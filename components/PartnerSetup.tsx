
import React, { useState, useEffect } from 'react';
import { PartnerProfile, Gender, MBTI, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { Button } from './Button';
import { Input, Select } from './Input';
import { ArrowLeft, UserPlus, Settings, BrainCircuit, HelpCircle, Lock, Home, X, Trash2 } from 'lucide-react';

interface PartnerSetupProps {
  onBack: () => void;
  onNext: (partner: PartnerProfile) => void;
  language: Language;
  onOpenSettings: () => void;
  isPro: boolean;
  onShowPaywall: () => void;
  onGoHome: () => void;
}

const STORAGE_KEY_PARTNERS = 'rizz_saved_partners';

const mbtiGroups = [
    { name: 'Analysts', color: 'bg-purple-500', border: 'border-purple-500', types: [MBTI.INTJ, MBTI.INTP, MBTI.ENTJ, MBTI.ENTP] },
    { name: 'Diplomats', color: 'bg-green-500', border: 'border-green-500', types: [MBTI.INFJ, MBTI.INFP, MBTI.ENFJ, MBTI.ENFP] },
    { name: 'Sentinels', color: 'bg-blue-500', border: 'border-blue-500', types: [MBTI.ISTJ, MBTI.ISFJ, MBTI.ESTJ, MBTI.ESFJ] },
    { name: 'Explorers', color: 'bg-yellow-500', border: 'border-yellow-500', types: [MBTI.ISTP, MBTI.ISFP, MBTI.ESTP, MBTI.ESFP] },
];

const languageOptions: { label: string; value: Language }[] = [
    { label: 'English', value: 'en' },
    { label: '日本語 (Japanese)', value: 'ja' },
    { label: 'Español (Spanish)', value: 'es' },
    { label: '한국어 (Korean)', value: 'ko' },
    { label: 'Français (French)', value: 'fr' },
    { label: 'Português (Portuguese)', value: 'pt' },
    { label: '中文 (Chinese)', value: 'zh' },
    { label: 'Русский (Russian)', value: 'ru' },
];

const politenessOptions = (t: any) => [
    { label: t.politeness_casual, value: 'Casual' },
    { label: t.politeness_polite, value: 'Polite' },
    { label: t.politeness_mixed, value: 'Mixed' },
];

export const PartnerSetup: React.FC<PartnerSetupProps> = ({ onBack, onNext, language, onOpenSettings, isPro, onShowPaywall, onGoHome }) => {
  const t = TRANSLATIONS[language];
  const [savedPartners, setSavedPartners] = useState<PartnerProfile[]>([]);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PartnerProfile>({
    id: '', name: '', gender: Gender.Female, age: 25, relation: 'Stranger', mbti: null as any, 
    goal: 'Casual', vibe: 'Witty', context: '', language: language, politeness: 'Casual'
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_PARTNERS);
    if (stored) { try { setSavedPartners(JSON.parse(stored)); } catch (e) { console.error(e); } }
  }, []);

  const savePartnerToStorage = (partner: PartnerProfile) => {
      const existingIndex = savedPartners.findIndex(p => p.id === partner.id);
      const newPartners = existingIndex >= 0 ? [...savedPartners] : [...savedPartners, partner];
      if (existingIndex >= 0) newPartners[existingIndex] = partner;
      setSavedPartners(newPartners);
      localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(newPartners));
  };

  const handleInitiateDelete = (e: React.MouseEvent, partnerId: string) => {
      e.stopPropagation(); setDeleteCandidateId(partnerId);
  };

  const confirmDelete = () => {
      const newPartners = savedPartners.filter(p => p.id !== deleteCandidateId);
      setSavedPartners(newPartners);
      localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(newPartners));
      if (formData.id === deleteCandidateId) handleNewPartner();
      setDeleteCandidateId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData, id: formData.id || Date.now().toString(), mbti: formData.mbti || MBTI.Unknown };
    savePartnerToStorage(finalData);
    onNext(finalData);
  };

  const handleSelectPartner = (partner: PartnerProfile) => setFormData({ ...partner, language: partner.language || language, politeness: partner.politeness || 'Casual', age: partner.age !== undefined ? partner.age : 25 });
  const handleNewPartner = () => setFormData({ id: '', name: '', gender: Gender.Female, age: 25, relation: 'Stranger', mbti: null as any, goal: 'Casual', vibe: 'Witty', context: '', language: language, politeness: 'Casual' });

  const handleOptionSelect = (type: 'goal' | 'vibe', value: string) => {
      if (value === 'Custom') {
          if (!isPro) { onShowPaywall(); return; }
          setFormData({ ...formData, [type]: '' });
      } else {
          setFormData({ ...formData, [type]: value });
      }
  };

  const standardRelations = ['Stranger', 'Friend', 'Colleague', 'Ex', 'Crush'];
  const standardGoals = ['Casual', 'Humor', 'Reconnect', 'Date', 'Intimacy'];
  const standardVibes = ['Witty', 'Sweet', 'Chill', 'Bold', 'Intellectual'];

  const goalOptions = standardGoals.map(v => ({ label: (t as any)[`goal_${v.toLowerCase()}`] || v, value: v }));
  goalOptions.push({ label: t.goal_custom, value: 'Custom' });

  const vibeOptions = standardVibes.map(v => ({ label: (t as any)[`vibe_${v.toLowerCase()}`] || v, value: v }));
  vibeOptions.push({ label: t.vibe_custom, value: 'Custom' });

  const isCustomRelation = !standardRelations.includes(formData.relation);
  const isCustomGoal = !standardGoals.includes(formData.goal);
  const isCustomVibe = !standardVibes.includes(formData.vibe);

  return (
    <div className="h-full w-full flex flex-col p-4 max-w-md mx-auto animate-in slide-in-from-right duration-500 relative">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white"><ArrowLeft /></button>
            <h2 className="text-xl font-bold ml-2">{t.who_texting}</h2>
        </div>
        <div className="flex items-center gap-1 -mr-2">
            <button onClick={onGoHome} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"><Home className="w-5 h-5" /></button>
            <button onClick={onOpenSettings} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"><Settings className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="mb-6 shrink-0">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{t.saved_partners}</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 pt-5 scrollbar-hide px-2">
            <button onClick={handleNewPartner} className={`flex flex-col items-center gap-2 min-w-[70px] p-2 rounded-xl border border-dashed border-slate-600 hover:bg-slate-800 transition-colors shrink-0 ${!formData.id ? 'bg-purple-500/10 border-purple-500' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center"><UserPlus className="w-5 h-5 text-white" /></div>
                <span className="text-xs font-medium text-slate-300 truncate w-full text-center">{t.new_partner}</span>
            </button>
            {savedPartners.map((p) => (
                <div key={p.id} className="relative group shrink-0">
                    <button onClick={() => handleSelectPartner(p)} className={`flex flex-col items-center gap-2 min-w-[70px] p-2 rounded-xl border transition-all ${formData.id === p.id ? 'bg-purple-600/20 border-purple-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">{p.name.charAt(0).toUpperCase()}</div>
                        <span className="text-xs font-medium text-slate-300 truncate w-full text-center max-w-[60px]">{p.name}</span>
                    </button>
                    <button onClick={(e) => handleInitiateDelete(e, p.id)} className="absolute -top-3 -right-2 bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-900 border border-slate-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors cursor-pointer z-50"><X className="w-4 h-4" /></button>
                </div>
            ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pb-24">
        <div className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700/50 space-y-4 backdrop-blur-sm">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg"><BrainCircuit className="w-5 h-5 text-purple-400" /></div>
            <h3 className="font-semibold text-slate-200">{t.partner_details}</h3>
           </div>
           
           <Input label={t.partner_name} value={formData.name} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
           <Select label={t.partner_lang_label} options={languageOptions} value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })} />
           <div className="grid grid-cols-2 gap-4">
             <Select label={t.their_gender} options={[{ label: t.gender_male, value: Gender.Male }, { label: t.gender_female, value: Gender.Female }, { label: t.gender_nb, value: Gender.NonBinary }, { label: t.gender_other, value: Gender.Other }]} value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })} />
             <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-400 ml-1">{t.their_age}</label>
                    <button type="button" onClick={() => setFormData({ ...formData, age: formData.age === null ? 25 : null })} className={`text-[10px] px-2 py-0.5 rounded transition-colors font-bold ${formData.age === null ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-slate-300'}`}>?</button>
                </div>
                {formData.age !== null ? <input className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 w-full" type="number" value={formData.age === 0 ? '' : formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value === '' ? 0 : parseInt(e.target.value) })} /> : <div className="bg-slate-800/50 border border-slate-700 text-slate-500 rounded-xl px-4 py-3 text-sm italic flex items-center gap-2"><HelpCircle className="w-4 h-4" /> {t.age_unknown}</div>}
             </div>
           </div>

           <Select label={t.politeness_label} options={politenessOptions(t)} value={formData.politeness} onChange={(e) => setFormData({ ...formData, politeness: e.target.value })} />
           <div className="space-y-2">
               <Select label={t.relation} options={[{ label: t.rel_stranger, value: 'Stranger' }, { label: t.rel_friend, value: 'Friend' }, { label: t.rel_colleague, value: 'Colleague' }, { label: t.rel_ex, value: 'Ex' }, { label: t.rel_crush, value: 'Crush' }, { label: t.rel_custom, value: 'Custom' }]} value={isCustomRelation ? 'Custom' : formData.relation} onChange={(e) => e.target.value === 'Custom' ? (!isPro ? onShowPaywall() : setFormData({...formData, relation: ''})) : setFormData({...formData, relation: e.target.value})} />
               {isCustomRelation && <Input label="" placeholder={t.rel_custom_placeholder} value={formData.relation} onChange={(e) => setFormData({ ...formData, relation: e.target.value })} autoFocus />}
           </div>

           <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1 flex justify-between"><span>{t.their_mbti}</span><span className={`text-xs font-bold ${!formData.mbti ? 'text-slate-500' : (formData.mbti === MBTI.Unknown ? 'text-cyan-400' : 'text-purple-400')}`}>{!formData.mbti ? t.mbti_unknown : (formData.mbti === MBTI.Unknown ? 'Unknown' : formData.mbti)}</span></label>
                <div className="grid grid-cols-4 gap-1.5">{mbtiGroups.map(group => group.types.map(type => <button type="button" key={type} onClick={() => setFormData({ ...formData, mbti: type })} className={`h-9 rounded-md text-[10px] font-bold border ${formData.mbti === type ? `${group.color} text-white ${group.border} scale-105` : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>{type}</button>))}</div>
                <button type="button" onClick={() => setFormData({ ...formData, mbti: MBTI.Unknown })} className={`w-full h-9 rounded-md text-xs font-bold border flex items-center justify-center gap-2 ${formData.mbti === MBTI.Unknown ? 'bg-cyan-600 text-white border-cyan-400 scale-105' : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'}`}><HelpCircle className="w-3.5 h-3.5" />{t.mbti_unknown}</button>
           </div>

           <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400 ml-1">{t.goal}</label>
                <div className="grid grid-cols-1 gap-2">
                    {goalOptions.map(opt => (
                        <button key={opt.value} type="button" onClick={() => handleOptionSelect('goal', opt.value)} className={`text-left px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${(opt.value === 'Custom' ? isCustomGoal : formData.goal === opt.value) ? 'bg-slate-700 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
                            <span className="text-sm">{opt.label}</span>
                            {opt.value === 'Custom' && !isPro && <Lock className="w-4 h-4 text-slate-500" />}
                        </button>
                    ))}
                </div>
                {isCustomGoal && <Input label="" placeholder={t.goal_custom_placeholder} value={formData.goal} onChange={(e) => setFormData({ ...formData, goal: e.target.value })} autoFocus />}
           </div>
           
           <div className="h-px bg-slate-700/50 my-2" />
           
           <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400 ml-1">{t.vibe_label}</label>
                <div className="grid grid-cols-1 gap-2">
                    {vibeOptions.map(opt => (
                        <button key={opt.value} type="button" onClick={() => handleOptionSelect('vibe', opt.value)} className={`text-left px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${(opt.value === 'Custom' ? isCustomVibe : formData.vibe === opt.value) ? 'bg-slate-700 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
                            <span className="text-sm">{opt.label}</span>
                            {opt.value === 'Custom' && !isPro && <Lock className="w-4 h-4 text-slate-500" />}
                        </button>
                    ))}
                </div>
                {isCustomVibe && <Input label="" placeholder={t.vibe_custom_placeholder} value={formData.vibe} onChange={(e) => setFormData({ ...formData, vibe: e.target.value })} autoFocus />}
           </div>

           <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-medium text-slate-400 ml-1">{t.context_label}</label>
                <div className="relative">
                    {!isPro && <div onClick={onShowPaywall} className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl cursor-pointer border border-yellow-500/30 transition-colors"><div className="bg-yellow-500/20 p-2 rounded-full border border-yellow-500/30 mb-1"><Lock className="w-5 h-5 text-yellow-400" /></div><span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Pro Only Feature</span></div>}
                    <textarea className={`w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 min-h-[80px] text-sm ${!isPro ? 'opacity-30' : ''}`} placeholder={t.context_placeholder} value={formData.context} onChange={(e) => setFormData({ ...formData, context: e.target.value })} disabled={!isPro} />
                </div>
           </div>
        </div>
        <Button type="submit" fullWidth>{t.next_upload}</Button>
      </form>

      {deleteCandidateId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-xs rounded-2xl shadow-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2"><Trash2 className="w-6 h-6 text-red-500" /></div>
                <div><h3 className="text-lg font-bold text-white">{t.delete_partner}</h3><p className="text-slate-400 text-sm mt-1">Are you sure you want to remove this profile?</p></div>
                <div className="flex gap-3 mt-4"><button onClick={() => setDeleteCandidateId(null)} className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm">Cancel</button><button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/50 font-bold text-sm shadow-lg shadow-red-900/20">Delete</button></div>
            </div>
        </div>
      )}
    </div>
  );
};
