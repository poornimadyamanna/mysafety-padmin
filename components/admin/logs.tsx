'use client';

import { useLogSocket } from '@/hooks/use-logs';
import { logsApi } from '@/lib/apicalls/logs';
import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
// import { useLogSocket } from '@/hooks/useLogSocket';
// import { logsApi } from '@/lib/api/logs';

interface LogFile {
    size: number;
    filename: string;
    path: string;
}
const API_URL = "https://mysafety24x7.in";

export default function LogViewer({ token }: { token: string }) {
    const [logFiles, setLogFiles] = useState<LogFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [connected, setConnected] = useState(false);
    const [offset, setOffset] = useState(0);

    const socketRef = useRef<Socket | null>(null);
    const logsContainerRef = useRef<HTMLDivElement>(null);
    const isLoadingMore = useRef(false);
    const shouldAutoScroll = useRef(true);

    // Initialize socket
    useEffect(() => {
        const socket = io(`${API_URL}/logs`, {
            auth: { token },
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));

        socket.on('newLogLine', (line: string) => {
            setLogs(prev => [...prev, line]);
            if (shouldAutoScroll.current) {
                setTimeout(() => scrollToBottom(), 100);
            }
        });

        socket.on('watchStarted', (filename: string) => {
            // console.log('Watching:', filename);
        });

        socket.on('logError', (error: string) => {
            console.error('Log error:', error);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, [token]);

    // Load log files
    useEffect(() => {
        loadLogFiles();
    }, []);

    // Handle file selection
    useEffect(() => {
        if (selectedFile) {
            loadLogFile(selectedFile);
        }
    }, [selectedFile]);

    // Check scroll position for auto-scroll
    const handleScroll = useCallback(() => {
        const container = logsContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        shouldAutoScroll.current = isAtBottom;

        // Load more when scrolling to top
        if (scrollTop < 100 && hasMore && !isLoadingMore.current) {
            loadMoreLogs();
        }
    }, [hasMore]);

    const loadLogFiles = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/logs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setLogFiles(data.logs);
            }
        } catch (error) {
            console.error('Error loading log files:', error);
        }
    };

    const loadLogFile = async (filename: string) => {
        setLoading(true);
        setLogs([]);
        setOffset(0);

        try {
            // Stop watching previous file
            socketRef.current?.emit('unwatchFile');

            // Load initial logs
            const res = await fetch(`${API_URL}/api/admin/logs/${filename}?limit=100&offset=0`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setLogs(data.lines);
                setHasMore(data.hasMore);
                setOffset(data.lines.length);

                // Start watching for new logs
                socketRef.current?.emit('watchFile', filename);

                setTimeout(() => scrollToBottom(), 100);
            }
        } catch (error) {
            console.error('Error loading log file:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreLogs = async () => {
        if (!selectedFile || isLoadingMore.current) return;

        isLoadingMore.current = true;
        const container = logsContainerRef.current;
        const previousScrollHeight = container?.scrollHeight || 0;

        try {
            const res = await fetch(
                `${API_URL}/api/admin/logs/${selectedFile}?limit=100&offset=${offset}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();

            if (data.success && data.lines.length > 0) {
                setLogs(prev => [...data.lines, ...prev]);
                setHasMore(data.hasMore);
                setOffset(prev => prev + data.lines.length);

                // Maintain scroll position
                setTimeout(() => {
                    if (container) {
                        const newScrollHeight = container.scrollHeight;
                        container.scrollTop = newScrollHeight - previousScrollHeight;
                    }
                }, 0);
            }
        } catch (error) {
            console.error('Error loading more logs:', error);
        } finally {
            isLoadingMore.current = false;
        }
    };

    const scrollToBottom = () => {
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    };

    const downloadLog = () => {
        if (!selectedFile) return;
        window.open(`${API_URL}/api/admin/logs/${selectedFile}/download`, '_blank');
    };

    return (
        <div className="flex h-screen bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
                <div className="p-4">
                    <h2 className="text-white font-semibold mb-4">Log Files</h2>
                    <div className="space-y-1">
                        {logFiles.map((file) => (
                            <button
                                key={file.filename}
                                onClick={() => setSelectedFile(file.filename)}
                                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedFile === file.filename
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <div className="font-medium truncate">{file.filename}</div>
                                <div className="text-xs opacity-70">
                                    {(file.size / 1024).toFixed(1)} KB
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-white text-xl font-semibold">System Logs</h1>
                        {selectedFile && (
                            <span className="text-gray-400 text-sm">{selectedFile}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={downloadLog}
                            disabled={!selectedFile}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            Download
                        </button>
                        <div className={`flex items-center gap-2 text-sm ${connected ? 'text-green-400' : 'text-red-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
                            {connected ? 'Connected' : 'Disconnected'}
                        </div>
                    </div>
                </div>

                {/* Logs Container */}
                <div
                    ref={logsContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 bg-black text-green-400 p-4 overflow-y-auto font-mono text-sm"
                >
                    {loading ? (
                        <div className="text-center text-gray-500">Loading...</div>
                    ) : logs.length === 0 ? (
                        <div className="text-center text-gray-500">
                            {selectedFile ? 'No logs available' : 'Select a log file to view'}
                        </div>
                    ) : (
                        <>
                            {hasMore && (
                                <div className="text-center text-gray-500 mb-2">
                                    Scroll up to load more...
                                </div>
                            )}
                            {logs.map((log, index) => (
                                <div key={index} className="whitespace-pre-wrap hover:bg-gray-900">
                                    {log}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}