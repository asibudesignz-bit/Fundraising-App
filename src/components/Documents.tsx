import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Upload, Search, Filter, MoreVertical, FileCode, FileType } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx';
  size: string;
  date: string;
  author: string;
}

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const docs: Document[] = [
    { id: '1', name: 'Financial_Report_Q1.pdf', type: 'pdf', size: '1.2 MB', date: '2024-03-15', author: 'Jane Smith' },
    { id: '2', name: 'Fundraising_Proposal_v2.docx', type: 'docx', size: '850 KB', date: '2024-03-10', author: 'John Doe' },
    { id: '3', name: 'Member_List_2024.pdf', type: 'pdf', size: '450 KB', date: '2024-03-01', author: 'Treasurer' },
  ];

  const filteredDocs = docs.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Documents</h2>
          <p className="text-slate-500">Access and manage department files</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#003366] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#003366]/20 hover:bg-[#002244] transition-all active:scale-95">
            <Upload size={20} />
            <span>Upload</span>
          </button>
        </div>
      </header>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold border border-slate-100 hover:bg-slate-100 transition-all">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <motion.div
              key={doc.id}
              whileHover={{ y: -4 }}
              className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-4 rounded-2xl",
                  doc.type === 'pdf' ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                )}>
                  {doc.type === 'pdf' ? <FileType size={32} /> : <FileCode size={32} />}
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-slate-400 hover:text-[#003366] hover:bg-white rounded-xl transition-all">
                    <Download size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
              <h4 className="font-bold text-slate-900 truncate mb-1">{doc.name}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>{doc.size}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>{doc.date}</span>
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {doc.author.charAt(0)}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{doc.author}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
