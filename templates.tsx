import React from 'react';
import { 
  User2, Mail, Phone, MapPin, Briefcase, FolderGit2, 
  GraduationCap, Wrench, Circle
} from 'lucide-react';
import { ResumeData, TemplateId } from './types';

interface ResumeRendererProps {
  data: ResumeData;
  templateId: TemplateId;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({ data, templateId }) => {
  
  // Helpers
  const getGenderText = () => data.personalInfo.gender === 'male' ? '男' : '女';
  const getFullTitle = () => `${data.personalInfo.jobTitle} | ${data.personalInfo.yearsExp}`;

  const renderContactItem = (Icon: any, text: string) => (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 opacity-80" />
      <span>{text}</span>
    </div>
  );

  // Template Renderers
  const renderClassicTemplate = () => (
    <div className="p-10 h-full flex flex-col text-gray-800 font-sans">
      <header className="border-b-2 border-gray-800 pb-6 mb-6 flex justify-between items-start">
        <div className="flex-1">
           <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{data.personalInfo.name}</h1>
           <p className="text-xl text-blue-800 font-medium mb-3">{getFullTitle()}</p>
           <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
             <div className="flex items-center gap-1.5"><User2 className="w-3.5 h-3.5 opacity-80"/> <span>{getGenderText()}</span></div>
             {data.mode === 'domestic' && renderContactItem(Phone, data.personalInfo.phone)}
             {renderContactItem(Mail, data.personalInfo.email)}
             {renderContactItem(MapPin, data.personalInfo.location)}
           </div>
        </div>
        {data.mode === 'domestic' && data.personalInfo.avatar && (
           <div className="w-32 h-32 border border-gray-200 shadow-sm ml-6 shrink-0">
             <img src={data.personalInfo.avatar} className="w-full h-full object-cover" />
           </div>
        )}
      </header>

      <div className="space-y-6 flex-1">
        <section>
          <h3 className="text-lg font-bold text-blue-800 uppercase tracking-wider border-b border-gray-200 pb-1 mb-3">教育背景</h3>
          <div className="space-y-2">
             {data.education.map(edu => (
               <div key={edu.id} className="flex justify-between items-end">
                 <div>
                   <span className="font-bold text-gray-900 mr-3">{edu.school}</span>
                   <span className="text-gray-600 text-sm">{edu.major} | {edu.degree}</span>
                 </div>
                 <div className="text-sm text-gray-500">{edu.dateRange}</div>
               </div>
             ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-blue-800 uppercase tracking-wider border-b border-gray-200 pb-1 mb-3">专业技能</h3>
           {data.skills.style === 'tags' ? (
             <div className="flex flex-wrap gap-2">
               {data.skills.list.map((s,i) => (
                 <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 text-sm font-medium border border-gray-200 rounded-sm">{s}</span>
               ))}
             </div>
           ) : (
             <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.skills.text}</p>
           )}
        </section>

        <section>
          <h3 className="text-lg font-bold text-blue-800 uppercase tracking-wider border-b border-gray-200 pb-1 mb-3">工作经历</h3>
          <div className="space-y-5">
            {data.work.map(w => (
               <div key={w.id}>
                 <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 text-lg">{w.company}</h4>
                    <span className="text-sm text-gray-500 font-medium">{w.dateRange}</span>
                 </div>
                 <p className="text-blue-700 font-medium text-sm mb-2">{w.jobTitle}</p>
               </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-blue-800 uppercase tracking-wider border-b border-gray-200 pb-1 mb-3">项目经验</h3>
          <div className="space-y-4">
            {data.projects.map(p => (
              <div key={p.id}>
                 <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900">{p.name}</h4>
                    <span className="text-sm text-gray-500">{p.dateRange}</span>
                 </div>
                 <div className="text-sm text-gray-600 space-y-1">
                   <p><span className="font-semibold text-gray-700">项目简介：</span>{p.intro}</p>
                   <p><span className="font-semibold text-gray-700">主要职责：</span>{p.responsibilities}</p>
                 </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderModernTemplate = () => (
    <div className="h-full flex bg-white font-sans">
       <div className="w-[30%] bg-slate-900 text-white p-8 flex flex-col gap-6 shrink-0">
          <div className="text-center">
             {data.mode === 'domestic' && (
                <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-slate-700 mb-4">
                   <img src={data.personalInfo.avatar} className="w-full h-full object-cover" />
                </div>
             )}
             <h1 className="text-xl font-bold mb-1">{data.personalInfo.name}</h1>
             <p className="text-slate-400 text-sm">{getFullTitle()}</p>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
             <div className="flex items-center gap-2"><User2 className="w-3.5 h-3.5"/> <span>{getGenderText()}</span></div>
             <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5"/> <span className="break-all">{data.personalInfo.email}</span></div>
             {data.mode === 'domestic' && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5"/> <span>{data.personalInfo.phone}</span></div>}
             <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5"/> <span>{data.personalInfo.location}</span></div>
          </div>

          <div className="border-t border-slate-700 pt-4">
             <h3 className="text-slate-100 font-bold uppercase tracking-widest text-xs mb-3">教育背景</h3>
             {data.education.map(edu => (
                <div key={edu.id} className="mb-3">
                   <div className="text-white font-bold text-sm">{edu.school}</div>
                   <div className="text-slate-400 text-xs mt-0.5">{edu.major}</div>
                   <div className="text-slate-500 text-xs mt-0.5">{edu.dateRange}</div>
                </div>
             ))}
          </div>

          <div className="border-t border-slate-700 pt-4 flex-1">
             <h3 className="text-slate-100 font-bold uppercase tracking-widest text-xs mb-3">技能专长</h3>
             {data.skills.style === 'tags' ? (
                <div className="flex flex-wrap gap-1.5">
                   {data.skills.list.map((s,i) => (
                      <span key={i} className="bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 text-xs rounded">{s}</span>
                   ))}
                </div>
             ) : (
                <p className="text-xs text-slate-400 leading-relaxed">{data.skills.text}</p>
             )}
          </div>
       </div>

       <div className="flex-1 p-8 text-slate-800">
          <section className="mb-8">
             <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-100 pb-2 mb-5">工作经历</h2>
             <div className="space-y-6">
                {data.work.map(w => (
                   <div key={w.id} className="relative pl-4 border-l-2 border-slate-200">
                      <div className="absolute w-2.5 h-2.5 bg-slate-900 rounded-full -left-[6px] top-1.5 ring-4 ring-white"></div>
                      <div className="flex justify-between items-baseline mb-1">
                         <h3 className="font-bold text-lg">{w.company}</h3>
                         <span className="text-sm text-slate-500 font-medium font-mono">{w.dateRange}</span>
                      </div>
                      <div className="text-slate-600 font-medium text-sm mb-1">{w.jobTitle}</div>
                   </div>
                ))}
             </div>
          </section>

          <section>
             <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-100 pb-2 mb-5">项目经验</h2>
             <div className="space-y-6">
                {data.projects.map(p => (
                   <div key={p.id}>
                      <div className="flex justify-between items-start mb-1">
                         <h3 className="font-bold text-base">{p.name}</h3>
                         <span className="text-xs text-slate-500 font-mono shrink-0">{p.dateRange}</span>
                      </div>
                      <div className="text-sm text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-lg">
                         <div><span className="font-bold text-slate-700">简介：</span>{p.intro}</div>
                         <div><span className="font-bold text-slate-700">职责：</span>{p.responsibilities}</div>
                      </div>
                   </div>
                ))}
             </div>
          </section>
       </div>
    </div>
  );

  const renderMinimalTemplate = () => (
    <div className="p-12 h-full flex flex-col text-gray-900 font-sans">
       <header className="text-center mb-10 relative">
          {data.mode === 'domestic' && data.personalInfo.avatar && (
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border border-gray-200">
              <img src={data.personalInfo.avatar} className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-3xl font-light uppercase tracking-widest mb-2">{data.personalInfo.name}</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">{getFullTitle()}</p>
          <div className="flex justify-center flex-wrap gap-4 text-xs text-gray-500 font-medium border-t border-b border-gray-100 py-3">
             <span>{getGenderText()}</span>
             <span>{data.personalInfo.email}</span>
             {data.mode === 'domestic' && <span>{data.personalInfo.phone}</span>}
             <span>{data.personalInfo.location}</span>
          </div>
       </header>

       <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
             <section>
                <h3 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-2 mb-3">Education</h3>
                {data.education.map(e => (
                   <div key={e.id} className="mb-2">
                      <div className="font-bold text-sm">{e.school}</div>
                      <div className="text-xs text-gray-600">{e.major}, {e.degree}</div>
                      <div className="text-xs text-gray-400 mt-0.5 font-mono">{e.dateRange}</div>
                   </div>
                ))}
             </section>
             <section>
                <h3 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-2 mb-3">Skills</h3>
                {data.skills.style === 'tags' ? (
                   <div className="text-xs text-gray-800 leading-6">
                      {data.skills.list.join('  •  ')}
                   </div>
                ) : (
                   <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {data.skills.text}
                   </div>
                )}
             </section>
          </div>

          <section>
             <h3 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-2 mb-4">Experience</h3>
             <div className="space-y-5">
                {data.work.map(w => (
                   <div key={w.id} className="grid grid-cols-[100px_1fr] gap-4">
                      <div className="text-xs text-gray-500 text-right pt-0.5 font-mono">{w.dateRange}</div>
                      <div>
                         <div className="font-bold text-sm mb-0.5">{w.company}</div>
                         <div className="text-xs italic text-gray-600 mb-1">{w.jobTitle}</div>
                      </div>
                   </div>
                ))}
             </div>
          </section>

          <section>
             <h3 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-2 mb-4">Projects</h3>
             <div className="space-y-5">
                {data.projects.map(p => (
                   <div key={p.id} className="grid grid-cols-[100px_1fr] gap-4">
                      <div className="text-xs text-gray-500 text-right pt-0.5 font-mono">{p.dateRange}</div>
                      <div>
                         <div className="font-bold text-sm mb-1">{p.name}</div>
                         <div className="text-xs text-gray-600 leading-relaxed">{p.intro}</div>
                         <div className="text-xs text-gray-500 leading-relaxed mt-1">{p.responsibilities}</div>
                      </div>
                   </div>
                ))}
             </div>
          </section>
       </div>
    </div>
  );

  const renderBannerTemplate = () => (
     <div className="h-full flex flex-col bg-white">
        <div className="bg-indigo-950 text-white p-8 pb-10 shadow-md shrink-0 flex justify-between items-center">
           <div>
             <h1 className="text-3xl font-bold mb-2 tracking-tight">{data.personalInfo.name}</h1>
             <p className="text-indigo-200 text-base font-medium">{getFullTitle()}</p>
              <div className="mt-4 text-xs space-y-1 text-indigo-100 font-light opacity-80">
                 <div>{getGenderText()} &bull; {data.personalInfo.location}</div>
                 <div>{data.personalInfo.email}</div>
                 {data.mode === 'domestic' && <div>{data.personalInfo.phone}</div>}
              </div>
           </div>
           {data.mode === 'domestic' && data.personalInfo.avatar && (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-800">
                <img src={data.personalInfo.avatar} className="w-full h-full object-cover" />
              </div>
           )}
        </div>

        <div className="flex-1 p-8 grid grid-cols-[2fr_1fr] gap-8">
           <div className="space-y-6">
              <section>
                 <h3 className="text-indigo-950 font-bold uppercase text-sm tracking-wider border-b-2 border-indigo-100 pb-2 mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4"/> 工作经历
                 </h3>
                 <div className="space-y-5">
                    {data.work.map(w => (
                       <div key={w.id}>
                          <div className="flex justify-between items-baseline">
                             <h4 className="font-bold text-gray-800 text-base">{w.company}</h4>
                             <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{w.dateRange}</span>
                          </div>
                          <p className="text-gray-500 font-medium text-xs mb-1">{w.jobTitle}</p>
                       </div>
                    ))}
                 </div>
              </section>

              <section>
                 <h3 className="text-indigo-950 font-bold uppercase text-sm tracking-wider border-b-2 border-indigo-100 pb-2 mb-4 flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4"/> 项目经验
                 </h3>
                 <div className="space-y-4">
                    {data.projects.map(p => (
                       <div key={p.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-start mb-1">
                             <h4 className="font-bold text-gray-800 text-sm">{p.name}</h4>
                             <span className="text-xs text-gray-400">{p.dateRange}</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{p.intro}</p>
                          <p className="text-xs text-gray-500 border-t border-gray-200 pt-2"><span className="font-semibold text-indigo-900">职责:</span> {p.responsibilities}</p>
                       </div>
                    ))}
                 </div>
              </section>
           </div>

           <div className="space-y-6">
               <section>
                 <h3 className="text-gray-800 font-bold uppercase text-sm mb-2">教育背景</h3>
                 {data.education.map(e => (
                    <div key={e.id} className="mb-3">
                       <div className="font-bold text-sm text-gray-900">{e.school}</div>
                       <div className="text-xs text-gray-500">{e.major}</div>
                       <div className="text-xs text-gray-400">{e.dateRange}</div>
                    </div>
                 ))}
               </section>

               <section>
                 <h3 className="text-gray-800 font-bold uppercase text-sm mb-2">技能清单</h3>
                 {data.skills.style === 'tags' ? (
                    <div className="flex flex-wrap gap-1.5">
                       {data.skills.list.map((s, i) => (
                          <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium border border-indigo-100">{s}</span>
                       ))}
                    </div>
                 ) : (
                    <p className="text-xs text-gray-600">{data.skills.text}</p>
                 )}
               </section>
           </div>
        </div>
     </div>
  );

  const renderCreativeTemplate = () => (
     <div className="p-8 h-full flex flex-col bg-white font-sans">
        <header className="flex gap-5 mb-8 items-center border-b-2 border-teal-50 pb-6">
           {data.mode === 'domestic' && data.personalInfo.avatar && (
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-teal-400 to-blue-500 shrink-0">
                 <img src={data.personalInfo.avatar} className="w-full h-full rounded-full object-cover border-2 border-white" />
              </div>
           )}
           <div className="flex-1">
              <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-1">
                 {data.personalInfo.name}
              </h1>
              <div className="inline-block bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold text-xs mb-3">
                 {getFullTitle()}
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 font-medium">
                 <span className="flex items-center gap-1"><User2 className="w-3 h-3"/> {getGenderText()}</span>
                 <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {data.personalInfo.email}</span>
                 <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {data.personalInfo.location}</span>
              </div>
           </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
           <div className="col-span-12 md:col-span-12 lg:col-span-12 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                       <GraduationCap className="w-4 h-4 text-teal-500" /> 教育背景
                    </h3>
                    {data.education.map(e => (
                       <div key={e.id} className="mb-3 border-l-2 border-teal-200 pl-3">
                          <div className="font-bold text-sm text-gray-800">{e.school}</div>
                          <div className="text-xs text-teal-600 font-medium">{e.major}</div>
                          <div className="text-[10px] text-gray-400">{e.dateRange}</div>
                       </div>
                    ))}
                 </div>
                 <div className="bg-gray-50 rounded-2xl p-4">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                       <Wrench className="w-4 h-4 text-teal-500" /> 技能栈
                    </h3>
                    {data.skills.style === 'tags' ? (
                       <div className="flex flex-wrap gap-1.5">
                          {data.skills.list.map((s,i) => (
                             <span key={i} className="bg-white text-teal-700 text-[10px] px-2 py-1 rounded-md shadow-sm border border-gray-100 font-medium">{s}</span>
                          ))}
                       </div>
                    ) : (
                       <p className="text-xs text-gray-600">{data.skills.text}</p>
                    )}
                 </div>
              </div>

              <section>
                 <h3 className="flex items-center gap-2 font-bold text-gray-800 text-base mb-4">
                    <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center"><Briefcase className="w-3.5 h-3.5"/></span>
                    工作经历
                 </h3>
                 <div className="space-y-5 pl-3 border-l-2 border-teal-50">
                    {data.work.map(w => (
                       <div key={w.id} className="relative">
                          <div className="absolute w-2 h-2 bg-teal-400 rounded-full -left-[19px] top-1.5 ring-4 ring-white"></div>
                          <h4 className="font-bold text-gray-800 text-sm">{w.company}</h4>
                          <div className="text-[10px] font-bold text-teal-600 mb-0.5 uppercase tracking-wider">{w.jobTitle}</div>
                          <div className="text-[10px] text-gray-400 mb-1">{w.dateRange}</div>
                       </div>
                    ))}
                 </div>
              </section>

              <section>
                 <h3 className="flex items-center gap-2 font-bold text-gray-800 text-base mb-4">
                    <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center"><FolderGit2 className="w-3.5 h-3.5"/></span>
                    项目经验
                 </h3>
                 <div className="grid grid-cols-1 gap-3">
                    {data.projects.map(p => (
                       <div key={p.id} className="bg-white border border-gray-100 shadow-sm rounded-xl p-3 hover:shadow-md transition-shadow hover:border-teal-100">
                          <div className="flex justify-between items-center mb-1">
                             <h4 className="font-bold text-gray-800 text-sm">{p.name}</h4>
                             <span className="text-[10px] text-gray-500">{p.dateRange}</span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                             <p>{p.intro}</p>
                             <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded"><span className="font-bold text-teal-600">Key: </span> {p.responsibilities}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </section>
           </div>
        </div>
     </div>
  );

  const renderProfessionalTemplate = () => (
    <div className="p-12 h-full flex flex-col text-gray-900 font-serif">
      <header className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-wide uppercase mb-2 font-serif">{data.personalInfo.name}</h1>
          <div className="text-sm italic text-gray-600 mb-4">{getFullTitle()}</div>
          <div className="flex gap-4 text-sm font-medium">
              <span>{getGenderText()}</span>
              <span>{data.personalInfo.email}</span>
              {data.mode === 'domestic' && <span>{data.personalInfo.phone}</span>}
              <span>{data.personalInfo.location}</span>
          </div>
        </div>
        {data.mode === 'domestic' && data.personalInfo.avatar && (
           <div className="w-32 h-32 border border-gray-200 shrink-0">
             <img src={data.personalInfo.avatar} className="w-full h-full object-cover" />
           </div>
        )}
      </header>

      <div className="space-y-6">
         <section>
            <h3 className="font-serif font-bold text-base uppercase border-b border-gray-300 mb-3">Education</h3>
            {data.education.map(e => (
               <div key={e.id} className="flex justify-between mb-2">
                  <div>
                     <div className="font-bold">{e.school}</div>
                     <div className="italic text-gray-700">{e.degree}, {e.major}</div>
                  </div>
                  <div className="text-right text-sm">{e.dateRange}</div>
               </div>
            ))}
         </section>
         
         <section>
            <h3 className="font-serif font-bold text-base uppercase border-b border-gray-300 mb-3">Skills</h3>
            {data.skills.style === 'tags' ? (
              <div className="text-sm leading-relaxed">{data.skills.list.join(', ')}</div>
            ) : (
               <p className="text-sm">{data.skills.text}</p>
            )}
         </section>

         <section>
            <h3 className="font-serif font-bold text-base uppercase border-b border-gray-300 mb-3">Work Experience</h3>
            <div className="space-y-4">
              {data.work.map(w => (
                 <div key={w.id}>
                    <div className="flex justify-between mb-1">
                       <div className="font-bold text-lg">{w.company}</div>
                       <div className="text-sm font-medium">{w.dateRange}</div>
                    </div>
                    <div className="italic text-gray-700 mb-1">{w.jobTitle}</div>
                 </div>
              ))}
            </div>
         </section>

         <section>
            <h3 className="font-serif font-bold text-base uppercase border-b border-gray-300 mb-3">Key Projects</h3>
            <div className="space-y-4">
               {data.projects.map(p => (
                  <div key={p.id}>
                     <div className="flex justify-between font-bold text-sm">
                        <span>{p.name}</span>
                        <span className="font-normal text-xs">{p.dateRange}</span>
                     </div>
                     <p className="text-sm text-gray-700 mt-1">{p.intro}</p>
                     <p className="text-sm text-gray-700 mt-1"><span className="italic">Role:</span> {p.responsibilities}</p>
                  </div>
               ))}
            </div>
         </section>
      </div>
    </div>
  );

  const renderTechTemplate = () => (
    <div className="p-10 h-full flex flex-col bg-white font-mono text-gray-800">
       <header className="flex justify-between items-start border-b-4 border-black pb-4 mb-8">
          <div>
             <h1 className="text-3xl font-bold mb-1">{`<${data.personalInfo.name} />`}</h1>
             <p className="text-sm text-gray-500">{getFullTitle()}</p>
             <div className="text-xs space-y-1 mt-3 text-gray-600">
                <div>Gender: {getGenderText()}</div>
                <div>{data.personalInfo.email}</div>
                {data.mode === 'domestic' && <div>{data.personalInfo.phone}</div>}
                <div>{data.personalInfo.location}</div>
             </div>
          </div>
          {data.mode === 'domestic' && data.personalInfo.avatar && (
            <div className="w-32 h-32 border-2 border-black p-1 shrink-0">
               <img src={data.personalInfo.avatar} className="w-full h-full object-cover filter contrast-125" />
            </div>
          )}
       </header>

       <div className="flex-1 space-y-8">
          <section>
             <h3 className="bg-black text-white inline-block px-2 py-1 text-sm font-bold mb-4">EDUCATION</h3>
             {data.education.map(e => (
                <div key={e.id} className="text-sm">
                   <span className="font-bold">{e.school}</span> / {e.major} / {e.degree} <span className="text-gray-400">[{e.dateRange}]</span>
                </div>
             ))}
          </section>

          <section>
             <h3 className="bg-black text-white inline-block px-2 py-1 text-sm font-bold mb-4">SKILLS_AND_STACK</h3>
             {data.skills.style === 'tags' ? (
                <div className="flex flex-wrap gap-2 text-xs">
                   {data.skills.list.map((s,i) => (
                      <span key={i} className="border border-gray-300 px-2 py-1">{s}</span>
                   ))}
                </div>
             ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 text-xs">{data.skills.text}</div>
             )}
          </section>

          <section>
             <h3 className="bg-black text-white inline-block px-2 py-1 text-sm font-bold mb-4">WORK_HISTORY</h3>
             <div className="space-y-6">
                {data.work.map(w => (
                   <div key={w.id} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex justify-between items-center mb-1">
                         <h4 className="font-bold text-lg">{w.company}</h4>
                         <span className="text-xs bg-gray-100 px-2 py-0.5">{w.dateRange}</span>
                      </div>
                      <div className="text-sm font-bold text-gray-500 mb-1">>> {w.jobTitle}</div>
                   </div>
                ))}
             </div>
          </section>

          <section>
             <h3 className="bg-black text-white inline-block px-2 py-1 text-sm font-bold mb-4">PROJECT_LOGS</h3>
             <div className="space-y-5">
                {data.projects.map(p => (
                   <div key={p.id}>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="font-bold text-sm">{p.name}</span>
                         <span className="text-xs text-gray-400">[{p.dateRange}]</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">{p.intro}</div>
                      <div className="text-xs text-gray-700 font-medium">Ref: {p.responsibilities}</div>
                   </div>
                ))}
             </div>
          </section>
       </div>
    </div>
  );

  const renderTimelineTemplate = () => (
    <div className="h-full bg-white flex flex-col p-10 font-sans">
       <header className="flex gap-6 items-center border-b-2 border-orange-500 pb-6 mb-8">
          {data.mode === 'domestic' && data.personalInfo.avatar && (
             <div className="w-32 h-32 rounded-full border-4 border-orange-100 overflow-hidden shrink-0">
                <img src={data.personalInfo.avatar} className="w-full h-full object-cover" />
             </div>
          )}
          <div className="flex-1">
             <h1 className="text-3xl font-bold text-gray-800">{data.personalInfo.name}</h1>
             <p className="text-orange-600 font-medium text-lg">{getFullTitle()}</p>
          </div>
          <div className="text-right text-sm text-gray-500">
             <div>{getGenderText()}</div>
             <div>{data.personalInfo.email}</div>
             {data.mode === 'domestic' && <div>{data.personalInfo.phone}</div>}
             <div>{data.personalInfo.location}</div>
          </div>
       </header>

       {/* Top Row: Education & Skills */}
       <div className="grid grid-cols-2 gap-10 mb-8 border-b border-gray-100 pb-8">
          <section>
             <h3 className="text-gray-800 font-bold border-b border-orange-200 pb-2 mb-4">教育背景</h3>
             {data.education.map(e => (
                <div key={e.id} className="mb-4">
                   <div className="font-bold text-sm">{e.school}</div>
                   <div className="text-xs text-gray-500">{e.major}</div>
                   <div className="text-xs text-orange-500 font-medium">{e.dateRange}</div>
                </div>
             ))}
          </section>

          <section>
             <h3 className="text-gray-800 font-bold border-b border-orange-200 pb-2 mb-4">技能专长</h3>
             {data.skills.style === 'tags' ? (
                <div className="flex flex-wrap gap-2">
                   {data.skills.list.map((s,i) => (
                      <span key={i} className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{s}</span>
                   ))}
                </div>
             ) : (
                <p className="text-sm text-gray-600">{data.skills.text}</p>
             )}
          </section>
       </div>

       {/* Bottom Row: Work & Projects */}
       <div className="flex-1 grid grid-cols-[1.5fr_1fr] gap-10">
          <div>
             <h3 className="text-orange-600 font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                <Circle className="w-3 h-3 fill-current"/> 经历时间轴
             </h3>
             <div className="border-l-2 border-orange-200 ml-1.5 space-y-8 pb-2">
                {data.work.map(w => (
                   <div key={w.id} className="relative pl-6">
                      <div className="absolute w-4 h-4 bg-orange-500 rounded-full -left-[9px] top-1 border-4 border-white"></div>
                      <span className="text-xs font-bold text-orange-400 mb-1 block">{w.dateRange}</span>
                      <h4 className="font-bold text-gray-800 text-lg">{w.company}</h4>
                      <div className="text-sm font-medium text-gray-600 mb-1">{w.jobTitle}</div>
                   </div>
                ))}
             </div>
          </div>

          <div>
             <h3 className="text-orange-600 font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                <Circle className="w-3 h-3 fill-current"/> 项目经验
             </h3>
             <div className="space-y-6">
                {data.projects.map(p => (
                   <div key={p.id} className="bg-orange-50 p-4 rounded-r-xl border-l-4 border-orange-400">
                      <h4 className="font-bold text-gray-800">{p.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{p.dateRange}</p>
                      <p className="text-sm text-gray-700">{p.intro}</p>
                      <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-orange-200">{p.responsibilities}</p>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  const renderCorporateTemplate = () => (
     <div className="h-full flex bg-white font-sans text-gray-800">
        {/* Left Sidebar */}
        <div className="w-[32%] bg-[#F3F4F6] p-8 flex flex-col gap-8 shrink-0 border-r border-gray-200">
           <div className="space-y-4">
              {data.mode === 'domestic' && data.personalInfo.avatar && (
                 <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-sm mx-auto">
                    <img src={data.personalInfo.avatar} className="w-full h-full object-cover" />
                 </div>
              )}
              
              <div className="space-y-2 text-sm text-gray-600">
                 <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs border-b border-gray-300 pb-2 mb-3">Contact</h3>
                 <div className="flex items-center gap-2"><User2 className="w-4 h-4"/> {getGenderText()}</div>
                 <div className="flex items-center gap-2"><Phone className="w-4 h-4"/> {data.personalInfo.phone}</div>
                 <div className="flex items-center gap-2"><Mail className="w-4 h-4"/> <span className="text-xs break-all">{data.personalInfo.email}</span></div>
                 <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {data.personalInfo.location}</div>
              </div>
           </div>

           <section>
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs border-b border-gray-300 pb-2 mb-4">Education</h3>
              <div className="space-y-4">
                 {data.education.map(e => (
                    <div key={e.id}>
                       <div className="font-bold text-sm text-gray-900">{e.school}</div>
                       <div className="text-xs text-gray-600">{e.major}</div>
                       <div className="text-xs text-gray-500">{e.degree}</div>
                       <div className="text-xs text-gray-400 mt-1">{e.dateRange}</div>
                    </div>
                 ))}
              </div>
           </section>

           <section>
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs border-b border-gray-300 pb-2 mb-4">Skills</h3>
              {data.skills.style === 'tags' ? (
                 <div className="flex flex-wrap gap-2">
                    {data.skills.list.map((s,i) => (
                       <span key={i} className="bg-white border border-gray-200 px-2 py-1 text-xs rounded text-gray-700">{s}</span>
                    ))}
                 </div>
              ) : (
                 <p className="text-xs text-gray-600">{data.skills.text}</p>
              )}
           </section>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10 pt-12">
           <header className="mb-10 border-b-2 border-gray-900 pb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-tight">{data.personalInfo.name}</h1>
              <p className="text-xl text-gray-500 font-light">{getFullTitle()}</p>
           </header>

           <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                 <span className="w-1 h-5 bg-gray-900 block"></span> Work Experience
              </h2>
              <div className="space-y-6">
                 {data.work.map(w => (
                    <div key={w.id}>
                       <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-lg text-gray-800">{w.company}</h3>
                          <span className="text-sm text-gray-500 font-medium">{w.dateRange}</span>
                       </div>
                       <div className="text-gray-600 font-medium text-sm mb-2">{w.jobTitle}</div>
                    </div>
                 ))}
              </div>
           </section>

           <section>
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                 <span className="w-1 h-5 bg-gray-900 block"></span> Project Experience
              </h2>
              <div className="space-y-6">
                 {data.projects.map(p => (
                    <div key={p.id}>
                       <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-base text-gray-800">{p.name}</h3>
                          <span className="text-sm text-gray-500">{p.dateRange}</span>
                       </div>
                       <div className="text-sm text-gray-600 space-y-1">
                          <p>{p.intro}</p>
                          <p className="text-gray-500 italic"><span className="font-semibold not-italic text-gray-700">Responsibility:</span> {p.responsibilities}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </section>
        </div>
     </div>
  );

  const renderElegantTemplate = () => (
     <div className="p-12 h-full flex flex-col bg-white font-serif text-gray-800">
        <header className="flex items-end justify-between border-b border-gray-300 pb-6 mb-8">
           <div className="space-y-2">
              <h1 className="text-5xl text-gray-900 tracking-tight" style={{ fontFamily: 'Noto Serif SC, serif' }}>{data.personalInfo.name}</h1>
              <p className="text-lg text-gray-600 italic">{getFullTitle()}</p>
           </div>
           {data.mode === 'domestic' && data.personalInfo.avatar && (
              <div className="w-28 h-28 shrink-0">
                 <img src={data.personalInfo.avatar} className="w-full h-full object-cover" />
              </div>
           )}
        </header>

        <div className="flex gap-10 text-sm text-gray-500 mb-10 font-sans border-b border-gray-100 pb-6">
           <span>{getGenderText()}</span>
           <span>{data.personalInfo.location}</span>
           <span>{data.personalInfo.phone}</span>
           <span>{data.personalInfo.email}</span>
        </div>

        <div className="space-y-8 flex-1">
           <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 font-sans">Education</h3>
              <div className="grid grid-cols-1 gap-4">
                 {data.education.map(e => (
                    <div key={e.id} className="flex justify-between items-baseline">
                       <div>
                          <span className="font-bold text-lg text-gray-900">{e.school}</span>
                          <span className="mx-2 text-gray-400">/</span>
                          <span className="italic text-gray-700">{e.major}</span>
                          <span className="mx-2 text-gray-400">/</span>
                          <span className="text-gray-600">{e.degree}</span>
                       </div>
                       <span className="text-sm text-gray-400 font-sans">{e.dateRange}</span>
                    </div>
                 ))}
              </div>
           </section>

           <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 font-sans">Skills</h3>
              {data.skills.style === 'tags' ? (
                 <div className="text-base text-gray-800 leading-relaxed border-l-2 border-gray-200 pl-4">
                    {data.skills.list.join('  ·  ')}
                 </div>
              ) : (
                 <p className="text-base text-gray-800 leading-relaxed border-l-2 border-gray-200 pl-4">{data.skills.text}</p>
              )}
           </section>

           <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 font-sans">Experience</h3>
              <div className="space-y-8">
                 {data.work.map(w => (
                    <div key={w.id}>
                       <div className="flex justify-between items-baseline mb-2">
                          <h4 className="font-bold text-xl text-gray-900">{w.company}</h4>
                          <span className="text-sm text-gray-400 font-sans">{w.dateRange}</span>
                       </div>
                       <div className="text-gray-600 font-medium mb-2">{w.jobTitle}</div>
                    </div>
                 ))}
              </div>
           </section>

           <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 font-sans">Projects</h3>
              <div className="space-y-6">
                 {data.projects.map(p => (
                    <div key={p.id}>
                       <div className="flex justify-between items-baseline mb-2">
                          <h4 className="font-bold text-lg text-gray-900">{p.name}</h4>
                          <span className="text-sm text-gray-400 font-sans">{p.dateRange}</span>
                       </div>
                       <div className="text-gray-700 leading-relaxed mb-2">{p.intro}</div>
                       <div className="text-sm text-gray-500 font-sans">Responsibility: {p.responsibilities}</div>
                    </div>
                 ))}
              </div>
           </section>
        </div>
     </div>
  );

  switch(templateId) {
    case 'modern': return renderModernTemplate();
    case 'minimal': return renderMinimalTemplate();
    case 'banner': return renderBannerTemplate();
    case 'creative': return renderCreativeTemplate();
    case 'professional': return renderProfessionalTemplate();
    case 'tech': return renderTechTemplate();
    case 'timeline': return renderTimelineTemplate();
    case 'corporate': return renderCorporateTemplate();
    case 'elegant': return renderElegantTemplate();
    case 'classic': default: return renderClassicTemplate();
  }
};
