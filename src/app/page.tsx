import React from 'react';
import { Calculator, BarChart3,  ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-100 flex">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Financial Dashboard</h2>
            <p className="text-slate-600">Comprehensive benefit calculations and bulk processing tools</p>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Benefit Calculate Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Benefit Calculator</h3>
                    <p className="text-slate-300 text-sm">Individual benefit calculations</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-slate-700 text-sm">Real-time calculations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-slate-700 text-sm">Detailed reporting</span>
                  </div>
                </div>
                <div className="mt-6">
                  <a 
                    href="/benefitCalculate" 
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-slate-700 text-white font-medium rounded-md hover:bg-slate-800 transition-colors"
                  >
                    Start Calculation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bulk Calculate Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-slate-500 to-slate-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Bulk Calculator</h3>
                    <p className="text-slate-300 text-sm">Process multiple calculations</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-slate-700 text-sm">Batch processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-slate-700 text-sm">CSV import/export</span>
                  </div>
                </div>
                <div className="mt-6">
                  <a 
                    href="/bulkCalculate" 
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-slate-600 text-white font-medium rounded-md hover:bg-slate-700 transition-colors"
                  >
                    Start Bulk Processing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Calculation Usage</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="8"
                      strokeDasharray="163.36 251.33"
                      strokeDashoffset="0"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="8"
                      strokeDasharray="87.96 251.33"
                      strokeDashoffset="-163.36"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-slate-800">2,847</div>
                      <div className="text-xs text-slate-500">Total</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                    <span className="text-sm text-slate-600">Individual</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">65% (1,851)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <span className="text-sm text-slate-600">Bulk</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">35% (996)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Trends</h3>
              <div className="h-40">
                <svg className="w-full h-full" viewBox="0 0 300 120">
      
                  <defs>
                    <pattern id="grid" width="30" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 24" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="300" height="120" fill="url(#grid)" />
                  

                  <polyline
                    fill="none"
                    stroke="#475569"
                    strokeWidth="2"
                    points="30,80 60,65 90,45 120,50 150,35 180,40 210,25 240,30 270,20"
                  />
                  
                  <circle cx="30" cy="80" r="3" fill="#475569" />
                  <circle cx="60" cy="65" r="3" fill="#475569" />
                  <circle cx="90" cy="45" r="3" fill="#475569" />
                  <circle cx="120" cy="50" r="3" fill="#475569" />
                  <circle cx="150" cy="35" r="3" fill="#475569" />
                  <circle cx="180" cy="40" r="3" fill="#475569" />
                  <circle cx="210" cy="25" r="3" fill="#475569" />
                  <circle cx="240" cy="30" r="3" fill="#475569" />
                  <circle cx="270" cy="20" r="3" fill="#475569" />
                  
 
                  <text x="30" y="115" textAnchor="middle" className="text-xs fill-slate-500">Jan</text>
                  <text x="90" y="115" textAnchor="middle" className="text-xs fill-slate-500">Mar</text>
                  <text x="150" y="115" textAnchor="middle" className="text-xs fill-slate-500">May</text>
                  <text x="210" y="115" textAnchor="middle" className="text-xs fill-slate-500">Jul</text>
                  <text x="270" y="115" textAnchor="middle" className="text-xs fill-slate-500">Sep</text>
                </svg>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Growth Rate</span>
                  <span className="text-sm font-medium text-green-600">+12.5%</span>
                </div>
              </div>
            </div>
          </div> */}
        </main>
      </div>
    </div>
  );
}