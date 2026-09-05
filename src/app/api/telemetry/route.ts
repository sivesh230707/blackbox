import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      nodeId: "NODE-04-B",
      classroom: "Room CS-402 Edge Node",
      status: "Online",
      sampleRate: "48kHz",
      codec: "FLAC (Lossless)",
      channels: "Stereo Array #2 (Clear)",
      speechModel: "Sarvam AI Neural Ingest v3.8",
      languages: ["ENG", "HIN", "TAM"],
      speechConfidence: 0.991,
      blackboardOcrStatus: "Active",
      equationsMapped: 19,
      privacyMode: {
        enabled: true,
        title: "Privacy Mode: Local Processing",
        policy: "100% On-Device Neural Compute • Zero Cloud Leakage",
        hardwareGuard: "Active (Secure Enclave)"
      },
      systemTime: new Date().toISOString()
    }
  });
}
