import React, { useState } from 'react';
import { Meal, Macros } from '../types';
import { analyzeFoodDescription } from '../services/geminiService';
import { Plus, Wand2, Loader2, Utensils } from 'lucide-react';

interface MealEntryProps {
  onAddMeal: (meal: Omit<Meal, 'id' | 'timestamp'>) => void;
}

const MealEntry: React.FC<MealEntryProps> = ({ onAddMeal }) => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  
  // Manual State
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [carbs, setCarbs] = useState<string>('');
  const [fat, setFat] = useState<string>('');
  const [mealType, setMealType] = useState<Meal['type']>('LUNCH');

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeFoodDescription(description);
    setIsAnalyzing(false);

    if (result) {
      setName(result.name);
      setCalories(result.calories.toString());
      setProtein(result.protein.toString());
      setCarbs(result.carbs.toString());
      setFat(result.fat.toString());
      setManualMode(true); // Switch to manual view to confirm/edit
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !calories) return;

    onAddMeal({
      name,
      calories: Number(calories),
      macros: {
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0
      },
      type: mealType
    });

    // Reset
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setDescription('');
    setManualMode(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Utensils className="text-emerald-500" size={20}/>
            Adicionar Refeição
        </h3>
        <button 
            onClick={() => setManualMode(!manualMode)}
            className="text-sm text-emerald-600 font-medium hover:underline"
        >
            {manualMode ? 'Usar IA' : 'Modo Manual'}
        </button>
      </div>

      {!manualMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-500 mb-2">Descreva sua refeição (IA)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: 100g de frango grelhado com 1 colher de arroz e salada"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-24"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !description.trim()}
            className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
            {isAnalyzing ? 'Analisando...' : 'Analisar com IA'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
           <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg"
              placeholder="Nome do prato"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Tipo</label>
                <select 
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                    <option value="BREAKFAST">Café da Manhã</option>
                    <option value="LUNCH">Almoço</option>
                    <option value="SNACK">Lanche</option>
                    <option value="DINNER">Jantar</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Calorias</label>
                <input
                type="number"
                required
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg"
                placeholder="kcal"
                />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Prot (g)</label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Carb (g)</label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Gord (g)</label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Adicionar Registro
          </button>
        </form>
      )}
    </div>
  );
};

export default MealEntry;
