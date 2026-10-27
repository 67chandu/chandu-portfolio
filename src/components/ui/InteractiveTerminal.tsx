import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Terminal, Copy, Check, Code2, Cpu, FileJson } from 'lucide-react'

type TabType = 'telemetry' | 'pipeline' | 'contact'

export function InteractiveTerminal() {
  const [activeTab, setActiveTab] = useState<TabType>('telemetry')
  const [copied, setCopied] = useState(false)

  const codeSnippets: Record<TabType, { filename: string; language: string; content: string }> = {
    telemetry: {
      filename: 'telemetry.sh',
      language: 'bash',
      content: `#!/usr/bin/env bash
# Chandu Challa System Telemetry & Core Profile
USER="chandu_challa"
DEGREE="B.Tech Computer Science & Engineering (AI & ML)"
ALMA_MATER="Malla Reddy University"
GRADUATION_YEAR="2025"
ACADEMIC_CGPA="7.65 / 10.0"
CORE_FOCUS="Computer Vision, Deep Learning, Full-Stack AI"
SYSTEM_STATUS="ONLINE // AVAILABLE FOR HIRE"
echo ">> Ready for immediate deployment in AI/ML & Full-Stack roles."`,
    },
    pipeline: {
      filename: 'yolo_pipeline.py',
      language: 'python',
      content: `import torch
from ultralytics import YOLO

class ProductionVisionEngine:
    """Production YOLOv8 Real-Time Surveillance & Object Pipeline"""
    def __init__(self, model_weights="yolov8x.pt"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = YOLO(model_weights).to(self.device)
        self.confidence_threshold = 0.85

    def stream_inference(self, frame_tensor):
        results = self.model.predict(
            source=frame_tensor,
            conf=self.confidence_threshold,
            device=self.device,
            verbose=False
        )
        return results[0].boxes`,
    },
    contact: {
      filename: 'contact.json',
      language: 'json',
      content: `{
  "engineer": "Chandu Challa",
  "location": "Hyderabad, Telangana, India",
  "timezone": "UTC+05:30 (IST)",
  "phone": "+91 90591 •••••• (Direct WhatsApp on site)",
  "email": "challachandu5c3@gmail.com",
  "github": "https://github.com/67chandu",
  "linkedin": "https://linkedin.com/in/chandu-challa",
  "naukri": "https://www.naukri.com/mnjuser/profile",
  "status": "Available for Full-Time Roles"
}`,
    },
  }

  const current = codeSnippets[activeTab]

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-3xl bg-[#07090e] border border-slate-800/90 shadow-2xl overflow-hidden font-mono text-left select-none backdrop-blur-xl">
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d1017] border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>chandu@core-terminal:~</span>
          </span>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-amber-200 transition cursor-pointer"
          aria-label="Copy terminal content"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1 px-3 pt-2 bg-[#090c13] border-b border-slate-800/60 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('telemetry')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-xl text-xs transition cursor-pointer ${
            activeTab === 'telemetry'
              ? 'bg-[#07090e] text-amber-300 border-t border-x border-slate-800 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>telemetry.sh</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-xl text-xs transition cursor-pointer ${
            activeTab === 'pipeline'
              ? 'bg-[#07090e] text-cyan-300 border-t border-x border-slate-800 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>yolo_pipeline.py</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-xl text-xs transition cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-[#07090e] text-purple-300 border-t border-x border-slate-800 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileJson className="w-3.5 h-3.5" />
          <span>contact.json</span>
        </button>
      </div>

      {/* Code Editor Body */}
      <div className="p-4 sm:p-5 overflow-x-auto text-xs leading-relaxed max-h-72">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-1 font-mono text-slate-300"
          >
            {current.content.split('\n').map((line, idx) => (
              <div key={idx} className="flex gap-4">
                <span className="w-6 text-right text-slate-600 select-none text-[11px]">
                  {idx + 1}
                </span>
                <span
                  className={
                    line.startsWith('#')
                      ? 'text-slate-500 italic'
                      : line.includes('def ') || line.includes('class ')
                      ? 'text-amber-300 font-semibold'
                      : line.includes('echo')
                      ? 'text-emerald-300'
                      : line.includes('"')
                      ? 'text-sky-300'
                      : 'text-slate-300'
                  }
                >
                  {line}
                </span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Terminal Footer */}
      <div className="px-4 py-2 bg-[#0d1017] border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>UTF-8 • {current.language.toUpperCase()} • 60 FPS</span>
        </span>
        <span className="text-amber-400/80">CHANDU CHALLA // PORTFOLIO</span>
      </div>
    </div>
  )
}

