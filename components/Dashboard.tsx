import React from 'react';
import { UserProfile, Meal } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Flame, Droplet, Zap, Utensils } from 'lucide-react';

interface DashboardProps {
  userProfile: UserProfile;
  todaysMeals: Meal[];
  healthTip: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, todaysMeals, healthTip }) => {
  const totalCalories = todaysMeals.reduce((acc, meal) => acc + meal.calories, 0);
  const totalProtein = todaysMeals.reduce((acc, meal) => acc + meal.macros.protein, 0);
  const totalCarbs = todaysMeals.reduce((acc, meal) => acc + meal.macros.carbs, 0);
  const totalFat = todaysMeals.reduce((acc, meal) => acc + meal.macros.fat, 0);

  const tdee = userProfile.tdee || 2000;
  const remaining = Math.max(0, tdee - totalCalories);
  
  // Chart Data
  const calorieData = [
    { name: 'Consumido', value: totalCalories },
    { name: 'Restante', value: remaining },
  ];
  
  const macroData = [
    { name: 'Prot', value: totalProtein, fill: '#3b82f6' }, // blue-500 (Primary)
    { name: 'Carb', value: totalCarbs, fill: '#10b981' },   // emerald-500 (Secondary)
    { name: 'Gord', value: totalFat, fill: '#f59e0b' },    // amber-500
  ];

  const COLORS = ['#3b82f6', '#e2e8f0']; // blue-500, slate-200

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Summary Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800">Olá, {userProfile.name}</h2>
            <p className="text-slate-500 text-sm mt-1">{healthTip}</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <TrendingUp size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">{userProfile.goal === 'LOSE' ? 'Perder Peso' : userProfile.goal === 'GAIN' ? 'Ganhar Massa' : 'Manter Peso'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calorie Ring */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative">
          <h3 className="text-lg font-semibold text-slate-700 w-full mb-2">Calorias Hoje</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={calorieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {calorieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-slate-800">{totalCalories}</span>
              <span className="text-sm text-slate-400">/ {tdee} kcal</span>
            </div>
          </div>
        </div>

        {/* Macro Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Macronutrientes (g)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={macroData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" barSize={32} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4 text-sm text-slate-500 px-4">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Prot</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Carb</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div>Gord</div>
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Registro Diário</h3>
        {todaysMeals.length === 0 ? (
          <p className="text-center text-slate-400 py-8">Nenhuma refeição registrada hoje.</p>
        ) : (
          <div className="space-y-3">
            {todaysMeals.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                        {meal.type === 'BREAKFAST' && <Zap size={16} />}
                        {meal.type === 'LUNCH' && <Utensils size={16} />}
                        {meal.type === 'DINNER' && <Flame size={16} />}
                        {meal.type === 'SNACK' && <Droplet size={16} />}
                    </div>
                    <div>
                        <p className="font-medium text-slate-800">{meal.name}</p>
                        <p className="text-xs text-slate-500">
                            P: {meal.macros.protein}g • C: {meal.macros.carbs}g • G: {meal.macros.fat}g
                        </p>
                    </div>
                </div>
                <div className="font-bold text-slate-700">{meal.calories} kcal</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;