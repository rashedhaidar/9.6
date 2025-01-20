import React, { useState, useEffect, useRef } from 'react';
    import { Layout, Calendar, BarChart, Sparkles, Brain, ClipboardList, Coins, BookOpen } from 'lucide-react';

    interface TabNavigationProps {
      activeTab: string;
      onTabChange: (tab: string) => void;
    }

    export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
      const tabs = [
        { id: 'evaluation', icon: <ClipboardList />, label: 'التقييم' },
        { id: 'weekly', icon: <Calendar />, label: 'الأيام' },
        { id: 'domains', icon: <Layout />, label: 'المجالات' },
        { id: 'financial', icon: <Coins />, label: 'المالية' },
        { id: 'writings', icon: <BookOpen />, label: 'مدوّنات' },
      ];

      const navRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (navRef.current) {
          const activeTabElement = navRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
          if (activeTabElement) {
            navRef.current.scrollTo({
              left: activeTabElement.offsetLeft - (navRef.current.offsetWidth - activeTabElement.offsetWidth) / 2,
              behavior: 'smooth',
            });
          }
        }
      }, [activeTab]);

      return (
        <nav className="flex justify-center mb-8 overflow-x-auto scrollbar-hide max-w-full">
          <div ref={navRef} className="flex gap-2 bg-black/30 p-1 rounded-lg whitespace-nowrap min-w-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-grow flex flex-col items-center justify-center px-2 py-1 rounded-md transition-colors group relative overflow-hidden min-w-0 text-sm md:text-base ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
                data-tab-id={tab.id}
              >
                <div className="flex items-center gap-1 md:gap-2">
                  {tab.icon}
                </div>
                <span className="whitespace-normal text-center">{tab.label}</span>
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full ${activeTab === tab.id ? 'w-full' : 'opacity-0'}`}></span>
              </button>
            ))}
          </div>
        </nav>
      );
    }
