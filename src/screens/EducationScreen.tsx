import React, { useState } from 'react';
import { educationContent } from './EducationContent';
import { educationContent2 } from './EducationContent2';
import { ChevronDown, ChevronUp, Search, BookOpen, Heart, AlertCircle, Sparkles } from 'lucide-react';

const allContent = [...educationContent, ...educationContent2];
const categoryIcons: Record<string, React.ReactNode> = {
  'Understanding PCOS': <BookOpen className="w-5 h-5" />,
  'Lifestyle Management': <Heart className="w-5 h-5" />,
  'When to Seek Care': <AlertCircle className="w-5 h-5" />
};
const categoryColors: Record<string, string> = {
  'Understanding PCOS': 'from-purple-500 to-purple-600',
  'Lifestyle Management': 'from-sage-500 to-sage-600',
  'When to Seek Care': 'from-amber-500 to-amber-600'
};

export const EducationScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = allContent.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const merged = filtered.reduce((acc, cat) => {
    const existing = acc.find(c => c.category === cat.category);
    if (existing) existing.items.push(...cat.items);
    else acc.push({ ...cat });
    return acc;
  }, [] as typeof filtered);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sage-600 to-peach-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Learn</h2>
        </div>
        <p className="text-white/80 text-sm">Evidence-based information about PCOS management</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
        <input type="text" placeholder="Search topics..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-sage-200 focus:ring-2 focus:ring-sage-400 focus:border-transparent focus:outline-none" />
      </div>

      <div className="space-y-6">
        {merged.map(category => (
          <div key={category.category}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryColors[category.category]} flex items-center justify-center text-white`}>
                {categoryIcons[category.category]}
              </div>
              <h3 className="font-semibold text-sage-800">{category.category}</h3>
            </div>
            <div className="space-y-2">
              {category.items.map(item => (
                <div key={item.title} className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
                  <button onClick={() => setExpanded(expanded === item.title ? null : item.title)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-sage-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 focus-visible:ring-inset">
                    <span className="font-medium text-sage-800">{item.title}</span>
                    {expanded === item.title ? <ChevronUp className="w-5 h-5 text-sage-400" /> : <ChevronDown className="w-5 h-5 text-sage-400" />}
                  </button>
                  {expanded === item.title && (
                    <div className="px-4 pb-4 text-sage-600 text-sm whitespace-pre-line border-t border-sage-100 pt-3 leading-relaxed">
                      {item.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {merged.length === 0 && (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-sage-300 mx-auto mb-3" />
          <p className="text-sage-500">No topics found for "{search}"</p>
        </div>
      )}

      <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 text-sm text-sage-700">
        <strong>Note:</strong> This information is for educational purposes only and does not replace professional medical advice.
      </div>
    </div>
  );
};
