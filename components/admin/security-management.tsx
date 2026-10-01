"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { setUpAuth, enableAuth, disableAuth, getExistingSetup } from "@/lib/apicalls/qrcode";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function TotpSetup() {
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState<any>(null);
    // const [otp, setOtp] = useState("");
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
    const router = useRouter();

    // ✅ AUTO FOCUS FIRST OTP
    useEffect(() => {
        setTimeout(() => {
            document.getElementById("otp-0")?.focus();
        }, 100);
    }, []);

    // ✅ OTP HANDLERS
    const handleOtpChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otpValues];
        newOtp[index] = value;
        setOtpValues(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpBackspace = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    //  FINAL OTP STRING FOR API
    const otp = otpValues.join("");

    useEffect(() => {
        if (qrData?.data?.qrCode) {
            QRCode.toDataURL(qrData.data.qrCode)
                .then((url) => setQrImage(url))
                .catch(() => setQrImage(null));
        }
    }, [qrData]);

    //  1. SETUP QR
    const handleSetup = async () => {
        try {
            setLoading(true);

            const res = await setUpAuth();
            // console.log("SETUP API RESPONSE 👉", res);

            // Force redirect if unauthorized
            if (res?.unauthorized) {
                router.push("/admin/login");
                toast.error("Session expired. Please login again.");
                return;
            }

            if (!res?.success) {
                toast.error(res?.error || "Setup failed");
                return;
            }
            toast.success("Two-factor authentication setup successfully");
            setQrData(res);
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    //  2. ENABLE AUTH
    const handleEnable = async () => {
        try {
            setLoading(true);

            const res = await enableAuth(otp);
            // console.log("ENABLE API RESPONSE ", res);

            //  Force redirect if unauthorized
            if (res?.unauthorized) {
                router.push("/admin/login");
                toast.error("Session expired. Please login again.");
                return;
            }

            if (!res?.success) {
                toast.error(res?.error || "Enable failed");
                return;
            }
            toast.success("Two-factor authentication enabled successfully");
            setQrData(null);
            setQrImage(null);
            setOtpValues(Array(6).fill(""));
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    //  3. FETCH EXISTING QR
    const handleExistingSetup = async () => {
        // console.log("clicked");

        try {
            setLoading(true);

            const res = await getExistingSetup();
            // console.log("EXISTING SETUP API RESPONSE ", res);

            //  Force redirect if unauthorized
            if (res?.unauthorized) {
                router.push("/admin/login");
                toast.error("Session expired. Please login again.");
                return;
            }

            if (!res?.success) {
                toast.error(res?.error || "Fetch existing setup is failed");
                return;
            }
            toast.success("Existing setup fetched successfully");
            setQrData(res);
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    //  4. DISABLE AUTH
    const handleDisable = async () => {
        try {
            setLoading(true);

            const res = await disableAuth(otp);
            // console.log("DISABLE API RESPONSE ", res);

            //  Force redirect if unauthorized
            if (res?.unauthorized) {
                router.push("/admin/login");
                toast.error("Session expired. Please login again.");
                return;
            }

            if (!res?.success) {
                toast.error(res?.error || "Disable failed");
                return;
            }

            toast.success("Two-factor authentication disabled successfully");
            setQrData(null);
            setQrImage(null);
            setOtpValues(Array(6).fill(""));
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md p-6 border rounded-xl space-y-5 bg-[#061235] text-white items-center mx-auto">

                {/* ✅ Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-wide">Two-Factor Authentication</h2>
                    <p className="text-sm text-gray-300 mt-1">Secure your account with Google Authenticator</p>
                </div>

                {/* ✅ SETUP */}
                <button
                    onClick={handleSetup}
                    disabled={loading}
                    className="w-full bg-[#FFCC00] hover:bg-yellow-500 text-white py-2 rounded cursor-pointer"
                >
                    {loading ? "Processing..." : "Setup Authenticator"}
                </button>

                {/* ✅ SHOW QR */}
                {qrImage && (
                    <div className="text-center space-y-2 mt-4">
                        <p className="text-sm font-medium">Scan this QR in Google Authenticator</p>
                        <img src={qrImage} className="mx-auto w-40 h-40" />
                    </div>
                )}

                {/* ✅ ENABLE and DISABLE OTP */}
                <div className="space-y-2">
                    <div className="flex justify-center gap-2">
                        {otpValues.map((val, i) => (
                            <input
                                key={i}
                                id={`otp-${i}`}
                                value={val}
                                onChange={(e) => handleOtpChange(e.target.value, i)}
                                onKeyDown={(e) => handleOtpBackspace(e, i)}
                                maxLength={1}
                                inputMode="numeric"
                                className="w-12 h-12 text-center text-lg font-bold rounded-lg border border-yellow-400 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleEnable}
                            disabled={loading || otp.length !== 6}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded cursor-pointer"
                        >
                            Enable
                        </button>
                        <button
                            onClick={handleDisable}
                            disabled={loading || otp.length !== 6}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded cursor-pointer"
                        >
                            Disable
                        </button>
                    </div>
                </div>

                {/* ✅ EXISTING SETUP */}
                <div className="space-y-2">
                    <button
                        onClick={handleExistingSetup}
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded cursor-pointer"
                    >
                        Get Existing QR
                    </button>
                </div>

            </div>
        </div>
    );
}
