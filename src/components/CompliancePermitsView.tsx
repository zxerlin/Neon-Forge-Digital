import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Copy, 
  Check, 
  Download,
  Building,
  Lock
} from 'lucide-react';
import { CompliancePermit } from '../types';
import { COMPLIANCE_CHECKLIST } from '../data/mockData';
import { playSound } from '../utils/audio';

export const CompliancePermitsView: React.FC = () => {
  const [permits] = useState<CompliancePermit[]>(COMPLIANCE_CHECKLIST);
  const [copiedAgreement, setCopiedAgreement] = useState(false);

  const sampleLicenseText = `=======================================================
NEONFORGE OS: HANDMADE DIGITAL ASSET COMMERCIAL LICENSE
=======================================================
Licensee: [Customer Name / Organization]
Transaction UUID: NF-LIC-VERIFIED-AUTH-2026
Permitted Territory: Worldwide, Perpetual, Royalty-Free

1. GRANT OF LICENSE:
The Licensor hereby grants the Licensee a non-exclusive, perpetual, worldwide commercial license to use, adapt, and incorporate the digital assets into commercial client projects, personal business operations, and end-user deliverables.

2. EXPRESS RESTRICTIONS (ANTI-PIRACY):
Licensee shall NOT:
(a) Sub-license, redistribute, resell, or distribute the raw source files as standalone templates;
(b) Upload raw source archives to open peer-to-peer, torrent, or public repositories;
(c) Claim original authorship of the underlying codebase or design system.

3. TAX & PERMITTING CLASSIFICATION:
Classified under SIC 7372 / NAICS 511210 (Software & Digital Goods Publishing). Delivered via automated electronic transmission without physical tangible personal property.

4. REFUND & CHARGEBACK POLICY:
Pursuant to FTC Guidelines and EU Consumer Rights Directive (Directive 2011/83/EU, Art. 16(m)), right of withdrawal is waived upon commencement of instant digital download.
=======================================================`;

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(sampleLicenseText);
    setCopiedAgreement(true);
    playSound('click');
    setTimeout(() => setCopiedAgreement(false), 2000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="font-mono text-lg font-bold uppercase text-white tracking-wide">
              PERMITS, TAX & DIGITAL COMPLIANCE STATION
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Full compliance infrastructure for selling handmade digital goods. Covers Etsy handmade policies (zero dropshipping risk), US Marketplace Facilitator tax rules, EU VAT MOSS, and commercial licensing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
            Compliance Score: 100% Verified
          </span>
        </div>
      </div>

      {/* 4 Pillars of Digital Legitimacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {permits.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-800 bg-[#090d18] hover:border-emerald-500/40 p-5 space-y-3 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                {item.category}
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {item.status}
              </span>
            </div>

            <h3 className="font-mono text-base font-bold text-white">
              {item.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {item.summary}
            </p>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5 font-bold">
                Required Operational Standards:
              </span>
              <ul className="space-y-1 text-xs font-mono text-slate-300">
                {item.practicalSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[10px] font-mono text-slate-400 pt-1">
              Legal Reference: {item.legalReference}
            </div>
          </div>
        ))}
      </div>

      {/* Commercial License & Legal Warranty Generator */}
      <div className="rounded-xl border border-emerald-500/40 bg-[#090d18] p-5 shadow-xl glow-lime space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
              AUTOMATED CONTRACT GENERATOR
            </span>
            <h3 className="font-mono text-base font-bold text-white mt-1">
              Handmade Digital Commercial License Agreement (Ready to Deploy)
            </h3>
          </div>

          <button
            onClick={handleCopyLicense}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            {copiedAgreement ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{copiedAgreement ? 'License Copied to Clipboard!' : 'Copy License Agreement'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-lg bg-black/80 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-56">
          {sampleLicenseText}
        </pre>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>This agreement is automatically compiled into every buyer deliverable container as a certified PDF.</span>
        </div>
      </div>
    </div>
  );
};
