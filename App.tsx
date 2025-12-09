import React, { useState, useEffect } from 'react';
import { UserProfile, Meal } from './types';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import MealEntry from './components/MealEntry';
import { LayoutDashboard, PlusCircle, UserCircle } from 'lucide-react';
import { getHealthTip } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'profile'>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [healthTip, setHealthTip] = useState<string>("Carregando dica...");

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('nutriflow_profile');
    const savedMeals = localStorage.getItem('nutriflow_meals');

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      setActiveTab('profile'); // Force profile creation
    }

    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    }
  }, []);

  // AI Health Tip Effect
  useEffect(() => {
      if (userProfile && activeTab === 'dashboard') {
          const todaysMeals = getTodaysMeals();
          const totalCals = todaysMeals.reduce((acc, m) => acc + m.calories, 0);
          
          getHealthTip(userProfile, totalCals).then(tip => {
              setHealthTip(tip);
          });
      }
  }, [userProfile, meals, activeTab]);

  const saveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('nutriflow_profile', JSON.stringify(profile));
    setActiveTab('dashboard');
  };

  const addMeal = (newMealData: Omit<Meal, 'id' | 'timestamp'>) => {
    const newMeal: Meal = {
      ...newMealData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    const updatedMeals = [newMeal, ...meals];
    setMeals(updatedMeals);
    localStorage.setItem('nutriflow_meals', JSON.stringify(updatedMeals));
    setActiveTab('dashboard');
  };

  const getTodaysMeals = () => {
    const today = new Date().toISOString().split('T')[0];
    return meals.filter(meal => {
        const mealDate = new Date(meal.timestamp).toISOString().split('T')[0];
        return mealDate === today;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
                N
            </div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-950">NutriFlow</h1>
          </div>
          {userProfile && (
            <div className="text-sm font-medium text-slate-500">
               {userProfile.tdee} kcal/dia
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4 md:p-6">
        {activeTab === 'profile' && (
          <Profile currentProfile={userProfile} onSave={saveProfile} />
        )}

        {activeTab === 'add' && (
           <div className="animate-in fade-in zoom-in-95 duration-200">
               <MealEntry onAddMeal={addMeal} />
           </div>
        )}

        {activeTab === 'dashboard' && userProfile && (
          <Dashboard 
            userProfile={userProfile} 
            todaysMeals={getTodaysMeals()} 
            healthTip={healthTip}
          />
        )}
        
        {activeTab === 'dashboard' && !userProfile && (
             <div className="text-center mt-20">
                 <p className="text-slate-500">Por favor, configure seu perfil para ver o painel.</p>
                 <button onClick={() => setActiveTab('profile')} className="mt-4 text-emerald-600 font-bold hover:underline">Ir para Perfil</button>
             </div>
        )}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-20">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-medium">Painel</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('add')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'add' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <PlusCircle size={24} />
            <span className="text-[10px] font-medium">Adicionar</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <UserCircle size={24} />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar/Tabs Placeholder (Hidden on mobile, visible on lg) */}
       <div className="hidden md:block fixed top-20 left-[max(0px,calc(50%-24rem-10rem))] w-32 space-y-4">
           {/* Desktop specific navigation could go here, for now relying on mobile-first bottom nav approach for simplicity but hiding it on desktop and adding a simple switcher if needed. Since the request is for a simple app, I'll rely on the state switcher. */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2 space-y-1">
                <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}>Painel</button>
                <button onClick={() => setActiveTab('add')} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'add' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}>Adicionar</button>
                <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'profile' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}>Perfil</button>
            </div>
       </div>

    </div>
  );
};

export default App;
