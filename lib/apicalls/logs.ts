const API_URL = "https://mysafety24x7.in";

export const logsApi = {
  // Get list of all log files
  async getLogFiles(token: string) {
    const res = await fetch(`${API_URL}/api/admin/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Get specific log file content
  async getLogContent(token: string, filename: string, lines = 100) {
    const res = await fetch(
      `${API_URL}/api/admin/logs/${filename}?lines=${lines}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res.json();
  },

  // Start streaming a log file
  async startStream(token: string, filename: string) {
    const res = await fetch(`${API_URL}/api/admin/logs/stream/${filename}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Stop streaming a log file
  async stopStream(token: string, filename: string) {
    const res = await fetch(
      `${API_URL}/api/admin/logs/stream/${filename}/stop`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res.json();
  },
};
