import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  User, Briefcase, GraduationCap, Wrench, FolderGit2, 
  Plus, Trash2, RefreshCw, Download, Palette, Check, X,
  Sparkles, Camera, Image as ImageIcon, ChevronRight, Sun, Moon, Loader2, Globe, Quote, Wand2, Upload
} from 'lucide-react';

import { ResumeData, Mode, Gender, SkillStyle, TemplateId } from './types';
import { INITIAL_DATA, TEMPLATES, MALE_AVATAR, FEMALE_AVATAR, NEUTRAL_AVATAR, INSPIRATIONAL_QUOTES } from './data';
import { ResumeRenderer } from './templates';

declare global {
  interface Window {
    html2pdf: any;
  }
}

const App = () => {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [isGeneratingName, setIsGeneratingName] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<TemplateId>('classic');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(INSPIRATIONAL_QUOTES[0]);
  
  // AI Image Editing State
  const [isAiImageProcessing, setIsAiImageProcessing] = useState(false);
  const [aiImagePrompt, setAiImagePrompt] = useState('');
  const [activeImageField, setActiveImageField] = useState<'avatar' | 'banner' | null>(null);

  const aiRef = useRef<GoogleGenAI | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Initialize AI
  useEffect(() => {
    if (process.env.API_KEY) {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }, []);

  // Update body class for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Quote Rotation Logic - 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
      setCurrentQuote(INSPIRATIONAL_QUOTES[randomIndex]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const markEdited = () => {
    if (!hasEdited) setHasEdited(true);
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: any) => {
    markEdited();
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handleModeChange = async (mode: Mode) => {
    markEdited();
    updatePersonalInfo('name', ''); 
    setData(prev => ({ ...prev, mode }));
    
    if (mode === 'remote') {
      await generateEnglishName(data.personalInfo.gender);
    } else {
      updatePersonalInfo('name', '张三'); 
    }
  };

  const handleGenderChange = (newGender: Gender) => {
    markEdited();
    const currentAvatar = data.personalInfo.avatar;
    const isDefault = currentAvatar === MALE_AVATAR || currentAvatar === FEMALE_AVATAR || currentAvatar === NEUTRAL_AVATAR || currentAvatar.includes('dicebear') || currentAvatar.startsWith('data:image/svg+xml');
    
    let newAvatar = currentAvatar;
    if (isDefault) {
       newAvatar = newGender === 'male' ? MALE_AVATAR : FEMALE_AVATAR;
    }

    setData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        gender: newGender,
        avatar: newAvatar
      }
    }));

    if (data.mode === 'remote') {
       generateEnglishName(newGender);
    }
  };

  const generateEnglishName = async (gender: Gender) => {
    if (!aiRef.current) return;
    setIsGeneratingName(true);
    try {
      const prompt = `Generate a single, professional English first and last name for a ${gender} professional. Return ONLY the name, nothing else.`;
      const response = await aiRef.current.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      const name = response.text?.trim() || (gender === 'male' ? 'John Doe' : 'Jane Doe');
      updatePersonalInfo('name', name);
    } catch (error) {
      console.error("Failed to generate name:", error);
      updatePersonalInfo('name', gender === 'male' ? 'John Doe' : 'Jane Doe');
    } finally {
      setIsGeneratingName(false);
    }
  };

  // Image Upload Handlers
  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updatePersonalInfo('avatar', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerClick = () => bannerInputRef.current?.click();
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       const reader = new FileReader();
       reader.onloadend = () => updatePersonalInfo('banner', reader.result as string);
       reader.readAsDataURL(file);
    }
  };

  // AI Image Editing Logic
  const handleAiImageEdit = async () => {
     if (!aiRef.current || !activeImageField) return;
     setIsAiImageProcessing(true);

     try {
        const currentImage = data.personalInfo[activeImageField];
        let imagePart = null;

        if (currentImage) {
           // Convert current image to base64 PNG if it's a data URI or try to fetch if it's a URL
           let base64Data = '';
           if (currentImage.startsWith('data:')) {
               base64Data = currentImage.split(',')[1];
           } else {
               // Attempt to fetch remote URL
               try {
                  const resp = await fetch(currentImage);
                  const blob = await resp.blob();
                  base64Data = await new Promise<string>((resolve) => {
                     const reader = new FileReader();
                     reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                     reader.readAsDataURL(blob);
                  });
               } catch (e) {
                  // If fetch fails (CORS), we can't edit.
                  console.warn("Could not fetch image for editing", e);
               }
           }
           
           if (base64Data) {
              imagePart = {
                 inlineData: {
                    mimeType: 'image/png',
                    data: base64Data
                 }
              };
           }
        }

        const parts: any[] = [];
        if (imagePart) parts.push(imagePart);
        parts.push({ text: aiImagePrompt });

        const response = await aiRef.current.models.generateContent({
           model: 'gemini-2.5-flash-image',
           contents: { parts }
        });

        // Extract image from response
        if (response.candidates && response.candidates[0].content.parts) {
           for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                 const newImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                 updatePersonalInfo(activeImageField, newImageUrl);
                 break;
              }
           }
        }
     } catch (error) {
        console.error("AI Image Generation Failed:", error);
        alert("图片生成失败，请稍后重试。");
     } finally {
        setIsAiImageProcessing(false);
        setActiveImageField(null);
        setAiImagePrompt('');
     }
  };

  const addArrayItem = <T extends { id: string }>(field: 'education' | 'work' | 'projects', newItem: T) => {
    markEdited();
    setData(prev => ({
      ...prev,
      [field]: [...prev[field], newItem]
    }));
  };

  const removeArrayItem = (field: 'education' | 'work' | 'projects', id: string) => {
    markEdited();
    setData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item.id !== id)
    }));
  };

  const updateArrayItem = (field: 'education' | 'work' | 'projects', id: string, key: string, value: string) => {
    markEdited();
    setData(prev => ({
      ...prev,
      [field]: prev[field].map(item => item.id === id ? { ...item, [key]: value } : item)
    }));
  };

  const updateSkillTag = (index: number, value: string) => {
    markEdited();
    const newList = [...data.skills.list];
    newList[index] = value;
    setData(prev => ({
      ...prev,
      skills: { ...prev.skills, list: newList }
    }));
  };

  const removeSkillTag = (index: number) => {
    markEdited();
    setData(prev => ({
      ...prev,
      skills: { ...prev.skills, list: prev.skills.list.filter((_, i) => i !== index) }
    }));
  };

  const addSkillTag = () => {
    markEdited();
    setData(prev => ({
      ...prev,
      skills: { ...prev.skills, list: [...prev.skills.list, '新技能'] }
    }));
  };

  const setSkillStyle = (style: SkillStyle) => {
    markEdited();
    setData(prev => ({...prev, skills: {...prev.skills, style}}));
  };

  const updateSkillsText = (text: string) => {
    markEdited();
    setData(prev => ({
      ...prev,
      skills: { ...prev.skills, text }
    }));
  };

  const handleExport = () => {
    if (!hasEdited) {
      alert("您还未进行编辑哦！");
      return;
    }
    setIsExporting(true);
    setTimeout(() => {
      const element = document.getElementById('resume-preview');
      if (element && window.html2pdf) {
        const opt = {
          margin: 0,
          filename: `${data.personalInfo.name || '我的'}_简历.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        window.html2pdf().set(opt).from(element).save()
          .then(() => setIsExporting(false))
          .catch((err: any) => {
             console.error('PDF export failed:', err);
             setIsExporting(false);
             alert("PDF生成失败，将尝试使用浏览器打印。");
             window.print();
          });
      } else {
        window.print();
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <div className={`flex flex-col h-screen font-sans bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300`}>
      {/* 1. Global Header */}
      <header className="h-16 bg-white/80 dark:bg-dark-bg/90 backdrop-blur-md border-b border-gray-200/50 dark:border-dark-border flex items-center justify-between px-6 shrink-0 z-40 sticky top-0 transition-all no-print">
        {/* Logo Section */}
        <div className="flex items-center gap-3 w-auto min-w-[200px]">
           <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
           </div>
           <div className="flex items-baseline gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-light-text dark:text-white">AI Resume</h1>
              <span className="text-[10px] font-medium text-gray-500 dark:text-dark-secondary bg-gray-100 dark:bg-dark-card px-1.5 py-0.5 rounded-full border dark:border-dark-border">v0.0.8</span>
           </div>
        </div>

        {/* Quotes Section */}
        <div className="flex-1 flex justify-center overflow-hidden px-4">
          <div className="flex items-center gap-3 w-full justify-center transition-all duration-500 ease-in-out">
            <Quote className="w-5 h-5 text-gray-300 dark:text-zinc-600 opacity-50 shrink-0 mb-4 hidden md:block" />
            <div className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 animate-gradient-x bg-[length:200%_auto] text-center tracking-wide">
              {currentQuote} 加油！{data.personalInfo.name || '你'}！
            </div>
            <Quote className="w-5 h-5 text-gray-300 dark:text-zinc-600 opacity-50 shrink-0 rotate-180 mt-4 hidden md:block" />
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3 w-auto min-w-[200px] justify-end">
           <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-600 dark:text-zinc-300 bg-gray-100/50 dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors border border-transparent dark:border-dark-border"
              title="切换主题"
           >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="text-xs font-medium">{isDarkMode ? '深色模式' : '浅色模式'}</span>
           </button>
           <button 
              onClick={() => setShowTemplateModal(true)}
              className="px-4 py-1.5 bg-gray-100/80 hover:bg-gray-200 dark:bg-dark-card dark:hover:bg-zinc-800 text-light-text dark:text-white text-sm font-medium rounded-full transition-all flex items-center gap-2 border border-transparent dark:border-dark-border"
           >
              <Palette className="w-4 h-4" /> 切换模板
           </button>
           <button 
              onClick={handleExport}
              disabled={isExporting}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all flex items-center gap-2 ${
                  isExporting 
                  ? 'bg-gray-300 dark:bg-zinc-800 cursor-not-allowed text-gray-500 dark:text-gray-400'
                  : 'bg-gray-900 hover:bg-gray-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 shadow-sm'
              }`}
           >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? '生成中...' : '导出 PDF'}
           </button>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <div className="flex flex-1 overflow-hidden p-6 gap-6 max-w-[1600px] mx-auto w-full relative">
        
        {/* AI Image Prompt Modal */}
        {activeImageField && (
           <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-2xl w-[400px] border border-gray-200 dark:border-dark-border animate-in zoom-in-95 duration-200">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                       <Wand2 className="w-5 h-5 text-purple-500"/> 
                       {activeImageField === 'avatar' ? 'AI 头像编辑' : 'AI 封面生成'}
                    </h3>
                    <button onClick={() => setActiveImageField(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                       <X className="w-5 h-5"/>
                    </button>
                 </div>
                 <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                       {activeImageField === 'avatar' 
                          ? "描述你想如何修改当前头像（例如：添加复古滤镜、戴上眼镜）。"
                          : "描述你想要的封面图风格（例如：简约几何风格、科技感背景）。"}
                    </p>
                    <textarea
                       value={aiImagePrompt}
                       onChange={(e) => setAiImagePrompt(e.target.value)}
                       placeholder={activeImageField === 'avatar' ? "例如: 变成卡通风格..." : "例如: 简约的蓝色几何背景..."}
                       className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 outline-none min-h-[100px] dark:text-white"
                    />
                    <button 
                       onClick={handleAiImageEdit}
                       disabled={isAiImageProcessing || !aiImagePrompt.trim()}
                       className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                       {isAiImageProcessing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
                       {isAiImageProcessing ? '正在生成...' : '开始生成'}
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* Left Panel: Editor (30% width) */}
        <div className="w-[30%] min-w-[320px] bg-light-card dark:bg-dark-card rounded-2xl shadow-sm border border-gray-200/50 dark:border-dark-border overflow-y-auto flex flex-col shrink-0 editor-panel no-scrollbar no-print transition-colors">
          <div className="p-6 space-y-8 pb-20">
            {/* 1. Global Settings */}
            <section>
              <h2 className="text-xs font-bold text-gray-500 dark:text-dark-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" /> 简历模式
              </h2>
              <div className="flex bg-gray-100/80 dark:bg-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => handleModeChange('domestic')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    data.mode === 'domestic' ? 'bg-white dark:bg-zinc-600 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  国内求职
                </button>
                <button
                  onClick={() => handleModeChange('remote')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    data.mode === 'remote' ? 'bg-white dark:bg-zinc-600 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  远程工作
                </button>
              </div>
            </section>

            {/* 2. Personal Info */}
            <section className="space-y-5">
              <h2 className="text-xs font-bold text-gray-500 dark:text-dark-secondary uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" /> 个人信息
              </h2>
              
              {/* Avatar Section */}
              <div className="flex items-center gap-5 p-4 bg-gray-50/80 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-dark-border transition-colors">
                 <div 
                    className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0 cursor-pointer relative group border border-gray-200 dark:border-zinc-700"
                    onClick={handleAvatarClick}
                 >
                    <img src={data.personalInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Camera className="w-5 h-5 text-white" />
                    </div>
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <button 
                          onClick={handleAvatarClick}
                          className="text-sm font-medium text-[#0071e3] hover:underline flex items-center gap-1"
                       >
                          <ImageIcon className="w-4 h-4" /> 上传头像
                       </button>
                       <button
                          onClick={() => {
                             setActiveImageField('avatar');
                             setAiImagePrompt('');
                          }}
                          className="p-1.5 text-purple-600 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                          title="AI 编辑头像"
                       >
                          <Wand2 className="w-3.5 h-3.5"/>
                       </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-dark-secondary">支持 JPG/PNG/SVG</p>
                    <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*"
                       onChange={handleAvatarChange}
                    />
                 </div>
              </div>
              
              {/* Banner Section */}
              <div className="flex items-center gap-5 p-4 bg-gray-50/80 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-dark-border transition-colors">
                  <div 
                    className="w-16 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0 border border-gray-200 dark:border-zinc-700 relative group"
                  >
                     {data.personalInfo.banner ? (
                       <img src={data.personalInfo.banner} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-zinc-700 text-gray-400">
                         <ImageIcon className="w-5 h-5"/>
                       </div>
                     )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <button 
                          onClick={handleBannerClick}
                          className="text-sm font-medium text-[#0071e3] hover:underline flex items-center gap-1"
                       >
                          <Upload className="w-4 h-4" /> 上传封面
                       </button>
                       <button
                          onClick={() => {
                             setActiveImageField('banner');
                             setAiImagePrompt(data.personalInfo.banner ? '' : '为我的简历网站设计一个简约风的banner'); // Pre-fill prompt for generation
                          }}
                          className="p-1.5 text-purple-600 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                          title={data.personalInfo.banner ? "AI 编辑封面" : "AI 生成封面"}
                       >
                          <Wand2 className="w-3.5 h-3.5"/>
                       </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-dark-secondary">仅部分模板支持</p>
                    <input 
                       type="file" 
                       ref={bannerInputRef} 
                       className="hidden" 
                       accept="image/*"
                       onChange={handleBannerChange}
                    />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-dark-secondary mb-1.5 ml-1">姓名</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={data.personalInfo.name}
                      onChange={(e) => updatePersonalInfo('name', e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-dark-input border border-transparent focus:border-[#0071e3]/30 rounded-xl focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-[#0071e3]/10 outline-none transition-all text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                      placeholder="姓名"
                    />
                    {data.mode === 'remote' && (
                      <button
                        onClick={() => generateEnglishName(data.personalInfo.gender)}
                        disabled={isGeneratingName}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0071e3] hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded-lg transition-colors"
                        title="重新生成英文名"
                      >
                        <RefreshCw className={`w-4 h-4 ${isGeneratingName ? 'animate-spin' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-dark-secondary mb-1.5 ml-1">性别</label>
                  <div className="relative">
                     <select
                        value={data.personalInfo.gender}
                        onChange={(e) => handleGenderChange(e.target.value as Gender)}
                        className="w-full p-3 bg-gray-50 dark:bg-dark-input border border-transparent focus:border-[#0071e3]/30 rounded-xl focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-[#0071e3]/10 outline-none transition-all text-sm appearance-none text-gray-900 dark:text-white"
                     >
                        <option value="male">男</option>
                        <option value="female">女</option>
                     </select>
                     <ChevronRight className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-dark-secondary mb-1.5 ml-1">工作年限</label>
                  <input
                    type="text"
                    value={data.personalInfo.yearsExp}
                    onChange={(e) => updatePersonalInfo('yearsExp', e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-dark-input border border-transparent focus:border-[#0071e3]/30 rounded-xl focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-[#0071e3]/10 outline-none transition-all text-sm text-gray-900 dark:text-white"
                    placeholder="例如: 3年"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-dark-secondary mb-1.5 ml-1">求职岗位</label>
                  <input
                    type="text"
                    value={data.personalInfo.jobTitle}
                    onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-dark-input border border-transparent focus:border-[#0071e3]/30 rounded-xl focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-[#0071e3]/10 outline-none transition-all text-sm text-gray-900 dark:text-white"
                  />
                </div>

                {data.mode === 'domestic' && (
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 dark:text-dark-secondary mb-1.5 ml-1">电话号码</label>
                    <input
                      type="text"
                      value={data.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-dark-input border border-transparent focus:border-[#0071e3]/30 rounded-xl focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-[#0071e3]/10 outline-none transition-all text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-dark-secondary mb-1.5 ml-1">邮箱</label>
                  <input
                    type="text"
                    value={data.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-dark-input border border-transparent focus:border-[#0071e3]/30 rounded-xl focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-[#0071e3]/10 outline-none transition-all text-sm text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-dark-secondary mb-1.5 ml-1">所在地</label>
                  <input
                    type="text"
                    value={data.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-dark-input border border-transparent focus:border-[#0071e3]/30 rounded-xl focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-[#0071e3]/10 outline-none transition-all text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </section>

            <div className="h-px bg-gray-100 dark:bg-dark-border my-2"></div>

            {/* 3. Education */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold text-gray-500 dark:text-dark-secondary uppercase tracking-widest flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" /> 教育经历
                </h2>
                <button 
                  onClick={() => addArrayItem('education', { id: Date.now().toString(), school: '新学校', major: '专业', degree: '学历', dateRange: '20xx-20xx' })}
                  className="w-full max-w-[120px] py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-[#0071e3] hover:text-white text-gray-600 dark:text-zinc-300 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 添加教育
                </button>
              </div>
              
              {data.education.map((edu) => (
                <div key={edu.id} className="bg-gray-50/80 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-dark-border relative group transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm">
                  <button 
                    onClick={() => removeArrayItem('education', edu.id)}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-6">
                    <div className="col-span-2">
                       <input 
                         className="w-full p-0 text-sm border-0 border-b border-gray-200 dark:border-zinc-700 focus:border-[#0071e3] focus:ring-0 outline-none bg-transparent font-medium text-gray-900 dark:text-white placeholder:text-gray-400 pb-1" 
                         value={edu.school}
                         onChange={(e) => updateArrayItem('education', edu.id, 'school', e.target.value)}
                         placeholder="学校名称"
                       />
                    </div>
                     <div>
                       <input 
                        className="w-full p-0 text-xs border-0 border-b border-gray-200 dark:border-zinc-700 focus:border-[#0071e3] focus:ring-0 outline-none bg-transparent text-gray-600 dark:text-zinc-400 pb-1" 
                        value={edu.dateRange}
                        onChange={(e) => updateArrayItem('education', edu.id, 'dateRange', e.target.value)}
                        placeholder="时间段"
                      />
                     </div>
                     <div>
                        <input 
                          className="w-full p-0 text-xs border-0 border-b border-gray-200 dark:border-zinc-700 focus:border-[#0071e3] focus:ring-0 outline-none bg-transparent text-gray-600 dark:text-zinc-400 pb-1" 
                          value={edu.degree}
                          onChange={(e) => updateArrayItem('education', edu.id, 'degree', e.target.value)}
                          placeholder="学历"
                        />
                     </div>
                    <div className="col-span-2">
                       <input 
                        className="w-full p-0 text-xs border-0 border-b border-gray-200 dark:border-zinc-700 focus:border-[#0071e3] focus:ring-0 outline-none bg-transparent text-gray-600 dark:text-zinc-400 pb-1" 
                        value={edu.major}
                        onChange={(e) => updateArrayItem('education', edu.id, 'major', e.target.value)}
                        placeholder="专业"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

             <div className="h-px bg-gray-100 dark:bg-dark-border my-2"></div>

            {/* 4. Skills */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold text-gray-500 dark:text-dark-secondary uppercase tracking-widest flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-gray-400" /> 掌握技能
                </h2>
                <div className="flex bg-gray-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs">
                  <button 
                     onClick={() => setSkillStyle('tags')}
                     className={`px-3 py-1 rounded-md transition-all ${data.skills.style === 'tags' ? 'bg-white dark:bg-zinc-600 shadow-sm text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-zinc-400'}`}
                  >
                    标签
                  </button>
                  <button 
                     onClick={() => setSkillStyle('lines')}
                     className={`px-3 py-1 rounded-md transition-all ${data.skills.style === 'lines' ? 'bg-white dark:bg-zinc-600 shadow-sm text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-zinc-400'}`}
                  >
                    文本
                  </button>
                </div>
              </div>

              {data.skills.style === 'tags' ? (
                <div className="bg-gray-50/80 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-dark-border">
                  <div className="flex flex-wrap gap-2">
                    {data.skills.list.map((skill, index) => (
                      <div key={index} className="flex items-center bg-white dark:bg-zinc-700 rounded-lg border border-gray-200 dark:border-zinc-600 shadow-sm pl-2 overflow-hidden group hover:border-blue-300 transition-colors">
                        <input 
                          type="text"
                          value={skill}
                          onChange={(e) => updateSkillTag(index, e.target.value)}
                          className="bg-transparent border-none text-xs p-1.5 w-20 outline-none text-gray-700 dark:text-gray-100 font-medium"
                        />
                        <button 
                          onClick={() => removeSkillTag(index)}
                          className="p-1.5 text-gray-300 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={addSkillTag}
                      className="flex items-center gap-1 text-xs text-[#0071e3] bg-blue-50/50 dark:bg-blue-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/50 transition-colors font-medium"
                    >
                      <Plus className="w-3 h-3" /> 添加
                    </button>
                  </div>
                </div>
              ) : (
                 <div>
                  <textarea
                    value={data.skills.text}
                    onChange={(e) => updateSkillsText(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-zinc-700 bg-gray-50/80 dark:bg-zinc-800/50 rounded-xl h-32 text-sm focus:border-[#0071e3] focus:ring-0 focus:bg-white dark:focus:bg-zinc-900 outline-none transition text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    placeholder="请输入技能描述..."
                  />
                </div>
              )}
            </section>

             <div className="h-px bg-gray-100 dark:bg-dark-border my-2"></div>

            {/* 5. Work Experience */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold text-gray-500 dark:text-dark-secondary uppercase tracking-widest flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" /> 工作经历
                </h2>
                <button 
                  onClick={() => addArrayItem('work', { id: Date.now().toString(), company: '公司名称', jobTitle: '职位', dateRange: '20xx.xx - 20xx.xx' })}
                  className="w-full max-w-[120px] py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-[#0071e3] hover:text-white text-gray-600 dark:text-zinc-300 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 添加经历
                </button>
              </div>
              
              {data.work.map((item) => (
                <div key={item.id} className="bg-gray-50/80 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-dark-border relative group transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm space-y-3">
                  <button 
                    onClick={() => removeArrayItem('work', item.id)}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="pr-6">
                     <input 
                      className="w-full p-0 text-sm border-0 border-b border-gray-200 dark:border-zinc-700 focus:border-[#0071e3] focus:ring-0 outline-none bg-transparent font-semibold text-gray-900 dark:text-white pb-1" 
                      value={item.company}
                      onChange={(e) => updateArrayItem('work', item.id, 'company', e.target.value)}
                      placeholder="公司名称"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <input 
                        className="w-full p-0 text-xs border-0 border-b border-gray-200 dark:border-zinc-700 focus:border-[#0071e3] focus:ring-0 outline-none bg-transparent text-gray-600 dark:text-zinc-400 pb-1" 
                        value={item.jobTitle}
                        onChange={(e) => updateArrayItem('work', item.id, 'jobTitle', e.target.value)}
                        placeholder="职位"
                      />
                    </div>
                    <div>
                       <input 
                        className="w-full p-0 text-xs border-0 border-b border-gray-200 dark:border-zinc-700 focus:border-[#0071e3] focus:ring-0 outline-none bg-transparent text-gray-600 dark:text-zinc-400 pb-1" 
                        value={item.dateRange}
                        onChange={(e) => updateArrayItem('work', item.id, 'dateRange', e.target.value)}
                        placeholder="时间段"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

             <div className="h-px bg-gray-100 dark:bg-dark-border my-2"></div>

            {/* 6. Project Experience */}
            <section className="space-y-4">
               <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold text-gray-500 dark:text-dark-secondary uppercase tracking-widest flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-gray-400" /> 项目经验
                </h2>
                <button 
                  onClick={() => addArrayItem('projects', { id: Date.now().toString(), name: '项目名称', dateRange: '20xx.xx - 20xx.xx', intro: '', responsibilities: '' })}
                  className="w-full max-w-[120px] py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-[#0071e3] hover:text-white text-gray-600 dark:text-zinc-300 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 添加项目
                </button>
              </div>

              {data.projects.map((item) => (
                <div key={item.id} className="bg-gray-50/80 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-dark-border relative group transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm space-y-4">
                  <button 
                    onClick={() => removeArrayItem('projects', item.id)}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4 pr-6">
                    <div>
                       <input 
                        className="w-full p-0 text-sm border-0 border-b border-gray-200 dark:border-zinc-700 focus:border-[#0071e3] focus:ring-0 outline-none bg-transparent font-semibold text-gray-900 dark:text-white pb-1" 
                        value={item.name}
                        onChange={(e) => updateArrayItem('projects', item.id, 'name', e.target.value)}
                        placeholder="项目名称"
                      />
                    </div>
                    <div>
                       <input 
                        className="w-full p-0 text-xs border-0 border-b border-gray-200 dark:border-zinc-700 focus:border-[#0071e3] focus:ring-0 outline-none bg-transparent text-gray-600 dark:text-zinc-400 pb-1" 
                        value={item.dateRange}
                        onChange={(e) => updateArrayItem('projects', item.id, 'dateRange', e.target.value)}
                        placeholder="时间段"
                      />
                    </div>
                  </div>
                  <div>
                      <textarea 
                        className="w-full p-3 text-xs border-0 bg-white dark:bg-zinc-700 rounded-lg focus:ring-1 focus:ring-[#0071e3]/30 outline-none shadow-sm text-gray-600 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                        rows={2}
                        value={item.intro}
                        onChange={(e) => updateArrayItem('projects', item.id, 'intro', e.target.value)}
                        placeholder="项目简介"
                      />
                  </div>
                  <div>
                      <textarea 
                        className="w-full p-3 text-xs border-0 bg-white dark:bg-zinc-700 rounded-lg focus:ring-1 focus:ring-[#0071e3]/30 outline-none shadow-sm text-gray-600 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                        rows={3}
                        value={item.responsibilities}
                        onChange={(e) => updateArrayItem('projects', item.id, 'responsibilities', e.target.value)}
                        placeholder="主要职责"
                      />
                  </div>
                </div>
              ))}
            </section>

          </div>
        </div>

        {/* Right Panel: Preview (70% width) */}
        <div className="flex-1 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 dark:border-dark-border overflow-y-auto flex justify-center items-start print-container p-8 no-scrollbar transition-colors">
          {/* Resume Paper */}
          <div id="resume-preview-container">
            <div id="resume-preview" className="a4-paper box-border bg-white shadow-2xl shrink-0 transition-transform origin-top">
               <ResumeRenderer data={data} templateId={currentTemplate} />
            </div>
          </div>
          
          {/* Template Selector Modal */}
          {showTemplateModal && (
            <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-6 modal-overlay">
               <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-6xl p-8 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto border dark:border-dark-border">
                  <button 
                     onClick={() => setShowTemplateModal(false)}
                     className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                     <X className="w-5 h-5" />
                  </button>
                  
                  <div className="mb-8">
                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2 tracking-tight">
                        <Palette className="w-6 h-6 text-[#0071e3]" /> 选择简历模板
                     </h2>
                     <p className="text-gray-500 dark:text-dark-secondary">选择一个最适合您职业风格的模板布局</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                     {TEMPLATES.map((t) => {
                        const isSelected = currentTemplate === t.id;
                        return (
                          <div 
                             key={t.id} 
                             className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 ${isSelected ? 'ring-2 ring-[#0071e3] shadow-xl' : 'border border-gray-200 dark:border-dark-border hover:shadow-lg dark:hover:bg-zinc-800'}`}
                             onClick={() => {
                                setCurrentTemplate(t.id);
                                setShowTemplateModal(false);
                             }}
                          >
                             {/* Mini Preview Placeholder with Color Hint */}
                             <div className={`h-40 ${t.color} opacity-90 relative`}>
                                <div className="absolute inset-4 bg-white/20 rounded-md backdrop-blur-sm"></div>
                                {/* Overlay Checkmark */}
                                {isSelected && (
                                   <div className="absolute top-2 right-2 bg-[#0071e3] text-white p-1 rounded-full shadow-md z-10">
                                      <Check className="w-3 h-3" />
                                   </div>
                                )}
                             </div>
                             
                             <div className="p-4 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-dark-border">
                                <div className="flex justify-between items-center mb-1">
                                   <span className={`font-bold text-sm ${isSelected ? 'text-[#0071e3]' : 'text-gray-900 dark:text-white'}`}>{t.name}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{t.description}</p>
                             </div>
                          </div>
                        );
                     })}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);