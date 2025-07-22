"use client"
import Link from 'next/link';
import Image from 'next/image';
import { Calculator, ChevronRight, Settings, ChevronLeft, ChevronRight as ChevronRightArrow } from 'lucide-react';
import React, { FC, useState } from 'react';
import { useStore } from '@/src/store/useStore';

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

const Sidebar: FC<SidebarProps> = ({ className }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['benefit-calculator']);
  const [activeItem, setActiveItem] = useState('benefit-calculator');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const {setBenefitCalRequiredFilelds, resetBenefitCalculatorFormData,setBenefitCalculatorProcessInstanceId,clearBenefitCalculatorFormValues,setBenefitCalculatorTaskInitiated,setCountBenefitCalculations,} =useStore();

  const menuItems: MenuItem[] = [
    {
      id: 'benefit-calculator',
      label: 'Benefit Calculator',
      icon: <Calculator size={20} />,
      subItems: [
        { id: 'Standard Calculator', label: 'Standard Calculator', href: '/benefitCalculate' },
        //{ id: 'Bulk Calculator', label: 'Bulk Calculator', href: '/bulkCalculate' }
      ]
    }
    // {
    //   id: 'monitoring',
    //   label: 'Monitoring',
    //   icon: <Activity size={20} />,
    //   href: '/monitoring'
    // }
  ];

  const toggleExpanded = (itemId: string) => {
    if (isCollapsed) return; // Don't expand items when sidebar is collapsed
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleStartNew = () => {
   
    setBenefitCalRequiredFilelds([]);
    setBenefitCalculatorProcessInstanceId(null);
    setBenefitCalculatorTaskInitiated(false);
    setCountBenefitCalculations(0);
    clearBenefitCalculatorFormValues();
    resetBenefitCalculatorFormData();
  };


  const handleItemClick = (itemId: string, hasSubItems: boolean) => {
    
    setActiveItem(itemId);
    
    if (hasSubItems && !isCollapsed) {
      toggleExpanded(itemId);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    // Close all expanded items when collapsing
    if (!isCollapsed) {
      setExpandedItems([]);
    } else {
      // Restore default expanded state when expanding
      setExpandedItems(['benefit-calculator']);
    }
  };

  return (
    <div className={`bg-[#f8f9fa] ${isCollapsed ? 'w-16' : 'w-64'} h-full border-r border-[#e1e5e9] flex flex-col transition-all duration-300 ease-in-out ${className} relative`}>
      {/* Collapse/Expand Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-[#e1e5e9] rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200 z-10 hover:bg-[#f3f2f1]"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRightArrow size={16} className="text-[#605e5c]" /> : <ChevronLeft size={16} className="text-[#605e5c]" />}
      </button>
      {/* Header */}
      <div className="p-4 border-b border-[#e1e5e9]">
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={100} 
            height={100} 
            className="w-12 h-12 object-contain rounded flex-shrink-0" 
          />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-[#605e5c] text-xs whitespace-nowrap">user</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          {menuItems.map((item) => (
            <div key={item.id} className="mb-1">
              {/* Main Menu Item */}
              <div
                className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors ${
                  activeItem === item.id
                    ? 'bg-[#deecf9] text-[#0078d4]'
                    : 'text-[#323130] hover:bg-[#f3f2f1]'
                }`}
                onClick={() => handleItemClick(item.id, !!item.subItems)}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className={`flex-shrink-0 ${activeItem === item.id ? 'text-[#0078d4]' : 'text-[#605e5c]'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.label}
                    </span>
                  )}
                </div>
                {item.subItems && !isCollapsed && (
                  <span className={`text-[#605e5c] transition-transform flex-shrink-0 ${
                    expandedItems.includes(item.id) ? 'rotate-90' : ''
                  }`}>
                    <ChevronRight size={16} />
                  </span>
                )}
              </div>

              {/* Sub Menu Items */}
              {item.subItems && expandedItems.includes(item.id) && !isCollapsed && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      onClick={() => handleStartNew()}
                      key={subItem.id}
                      href={subItem.href}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-[#605e5c] hover:bg-[#f3f2f1] hover:text-[#323130] rounded transition-colors"
                    >
                      {subItem.icon && <span className="flex-shrink-0">{subItem.icon}</span>}
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis">{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#e1e5e9]">
        <button 
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[#605e5c] hover:bg-[#f3f2f1] hover:text-[#323130] rounded transition-colors"
          title={isCollapsed ? 'Project Settings' : undefined}
        >
          <Settings size={16} className="flex-shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Project Settings</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;