import React, { useState, useEffect } from 'react';
import { UserProfile, Gender, ActivityLevel } from '../types';
import { Save, User } from 'lucide-react';

interface ProfileProps {
  currentProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ currentProfile, onSave }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    weight: 70,
    height: 170,
    gender: Gender.MALE,
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
    goal: 'MAINTAIN',
  });

  useEffect(() => {
    if (currentProfile) {
      setProfile(currentProfile);
    }
  }, [currentProfile]);

  const calculateTDEE = (p: UserProfile): number => {
    // Mifflin-St Jeor Equation
    let bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age;
    if (p.gender === Gender.MALE) {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    let multiplier = 1.2;
    switch (p.activityLevel) {
      case ActivityLevel.SEDENTARY: multiplier = 1.2; break;
      case ActivityLevel.LIGHTLY_ACTIVE: multiplier = 1.375; break;
      case ActivityLevel.MODERATELY_ACTIVE: multiplier = 1.55; break;
      case ActivityLevel.VERY_ACTIVE: multiplier = 1.725; break;
      case ActivityLevel.EXTRA_ACTIVE: multiplier = 1.9; break;
    }

    let tdee = Math.round(bmr * multiplier);

    // Adjust for goal
    if (p.goal === 'LOSE') tdee -= 500;
    if (p.goal === 'GAIN') tdee += 500;

    return tdee;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tdee = calculateTDEE(profile);
    onSave({ ...profile, tdee });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-6 text-emerald-600">
        <User size={24} />
        <h2 className="text-xl font-bold">Seu Perfil</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
          <input
            type="text"
            required
            value={profile.name}
            onChange={e => setProfile({...profile, name: e.target.value})}
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Idade</label>
            <input
              type="number"
              required
              value={profile.age}
              onChange={e => setProfile({...profile, age: Number(e.target.value)})}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gênero</label>
            <select
              value={profile.gender}
              onChange={e => setProfile({...profile, gender: e.target.value as Gender})}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value={Gender.MALE}>Masculino</option>
              <option value={Gender.FEMALE}>Feminino</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Peso (kg)</label>
            <input
              type="number"
              required
              step="0.1"
              value={profile.weight}
              onChange={e => setProfile({...profile, weight: Number(e.target.value)})}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Altura (cm)</label>
            <input
              type="number"
              required
              value={profile.height}
              onChange={e => setProfile({...profile, height: Number(e.target.value)})}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nível de Atividade</label>
          <select
            value={profile.activityLevel}
            onChange={e => setProfile({...profile, activityLevel: e.target.value as ActivityLevel})}
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value={ActivityLevel.SEDENTARY}>Sedentário (Pouco exercício)</option>
            <option value={ActivityLevel.LIGHTLY_ACTIVE}>Levemente Ativo (1-3 dias)</option>
            <option value={ActivityLevel.MODERATELY_ACTIVE}>Moderadamente Ativo (3-5 dias)</option>
            <option value={ActivityLevel.VERY_ACTIVE}>Muito Ativo (6-7 dias)</option>
            <option value={ActivityLevel.EXTRA_ACTIVE}>Extremamente Ativo (Trabalho físico)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Objetivo</label>
          <select
            value={profile.goal}
            onChange={e => setProfile({...profile, goal: e.target.value as any})}
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="LOSE">Perder Peso (-500kcal)</option>
            <option value="MAINTAIN">Manter Peso</option>
            <option value="GAIN">Ganhar Massa (+500kcal)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Salvar Perfil
        </button>
      </form>
    </div>
  );
};

export default Profile;
