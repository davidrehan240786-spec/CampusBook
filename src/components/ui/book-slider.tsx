import React from 'react';
import HTMLFlipBook from "react-pageflip";
import { BookOpen, Users, Lightbulb, ListChecks, Workflow, HelpCircle } from 'lucide-react';

const BookSlider = () => {
  return (
    <div className="flex items-center justify-center w-full pt-10 pb-40 overflow-hidden">
      <div className="book-reflection-container">
        {/* @ts-ignore */}
        <HTMLFlipBook 
          width={370} 
          height={500}
          maxShadowOpacity={0.3}
          drawShadow={true}
          showCover={true}
          size='fixed'
          className="rounded-lg"
        >
          {/* Page 1: Cover Page */}
          <div className="page bg-primary flex items-center justify-center border-2 border-dark rounded-r-lg overflow-hidden">
            <div className="page-content cover flex flex-col items-center justify-center p-10 text-center">
              <div className="w-24 h-24 bg-white border-4 border-dark rounded-3xl flex items-center justify-center text-primary mb-8 shadow-[6px_6px_0_0_rgba(25,26,35,1)]">
                <BookOpen size={48} />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Campus Book<br/>Exchange</h1>
              <p className="mt-4 text-white/80 font-bold text-xl tracking-tight">Student Platform</p>
              <div className="mt-8 px-4 py-1 bg-secondary text-dark font-black text-xs rounded-full uppercase tracking-widest">
                Mini Project
              </div>
              <div className="mt-12 w-20 h-1 bg-white/30 rounded-full" />
            </div>
          </div>

          {/* Page 2: Student 1 */}
          <div className="page bg-white border-2 border-dark">
            <div className="page-content p-10 h-full flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 rounded-full border-4 border-dark overflow-hidden mb-8 shadow-[8px_8px_0_0_#D9E6CA]">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop" alt="Student" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-4xl font-black text-dark mb-2">ABC</h2>
              <div className="px-6 py-2 bg-dark text-white rounded-xl font-bold text-lg">
                USN: 123
              </div>
              <div className="mt-auto text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Project Contributor</div>
            </div>
          </div>

          {/* Page 3: Student 2 */}
          <div className="page bg-white border-2 border-dark">
            <div className="page-content p-10 h-full flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 rounded-full border-4 border-dark overflow-hidden mb-8 shadow-[8px_8px_0_0_#778667]">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop" alt="Student" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-4xl font-black text-dark mb-2">GDU</h2>
              <div className="px-6 py-2 bg-dark text-white rounded-xl font-bold text-lg">
                USN: 375
              </div>
              <div className="mt-auto text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Project Contributor</div>
            </div>
          </div>

          {/* Page 4: Student 3 */}
          <div className="page bg-white border-2 border-dark">
            <div className="page-content p-10 h-full flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 rounded-full border-4 border-dark overflow-hidden mb-8 shadow-[8px_8px_0_0_#D9E6CA]">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop" alt="Student" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-4xl font-black text-dark mb-2">IFS</h2>
              <div className="px-6 py-2 bg-dark text-white rounded-xl font-bold text-lg">
                USN: 240
              </div>
              <div className="mt-auto text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Project Contributor</div>
            </div>
          </div>

          {/* Page 5: Student 4 */}
          <div className="page bg-white border-2 border-dark">
            <div className="page-content p-10 h-full flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 rounded-full border-4 border-dark overflow-hidden mb-8 shadow-[8px_8px_0_0_#778667]">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop" alt="Student" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-4xl font-black text-dark mb-2">IRY</h2>
              <div className="px-6 py-2 bg-dark text-white rounded-xl font-bold text-lg">
                USN: 346
              </div>
              <div className="mt-auto text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Project Contributor</div>
            </div>
          </div>

          {/* Page 6: Project Idea */}
          <div className="page bg-secondary border-2 border-dark">
            <div className="page-content p-10 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white border-2 border-dark rounded-xl flex items-center justify-center text-dark">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Project Idea</h3>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-2xl font-bold text-dark leading-tight italic">
                  "A platform where students can list, request, and exchange books with each other, reducing cost and promoting reuse."
                </p>
                <div className="mt-10 w-16 h-1 bg-dark/20 rounded-full" />
              </div>
              <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&auto=format&fit=crop" alt="Books" className="w-full h-32 object-cover rounded-2xl border-2 border-dark mt-8" referrerPolicy="no-referrer" />
            </div>
          </div>

          {/* Page 7: Features */}
          <div className="page bg-white border-2 border-dark">
            <div className="page-content p-10 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-primary border-2 border-dark rounded-xl flex items-center justify-center text-white">
                  <ListChecks size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Features</h3>
              </div>
              <ul className="space-y-6">
                {[
                  "Book Listing",
                  "Request Book",
                  "Buy / Show Interest",
                  "Campus-Based Access",
                  "Dashboard Tracking"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 bg-secondary border-2 border-dark rounded-lg flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <span className="font-bold text-lg text-dark">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Page 8: How It Works */}
          <div className="page bg-dark border-2 border-dark text-white">
            <div className="page-content p-10 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-secondary border-2 border-white rounded-xl flex items-center justify-center text-dark">
                  <Workflow size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">How It Works</h3>
              </div>
              <div className="space-y-8">
                {[
                  { t: "List a book", d: "Add details and photos" },
                  { t: "Show interest", d: "Connect with the owner" },
                  { t: "Meet offline", d: "Safe campus exchange" },
                  { t: "Mark as sold", d: "Complete the cycle" }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1 h-full bg-secondary/30 rounded-full" />
                    <div>
                      <h4 className="font-black text-lg text-secondary uppercase leading-none mb-1">{step.t}</h4>
                      <p className="text-white/60 font-medium text-sm">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Page 9: End Page */}
          <div className="page bg-primary flex items-center justify-center border-2 border-dark rounded-l-lg overflow-hidden">
            <div className="page-content cover flex flex-col items-center justify-center p-10 text-center">
              <div className="w-20 h-20 bg-white border-4 border-dark rounded-full flex items-center justify-center text-primary mb-8 animate-bounce">
                <HelpCircle size={40} />
              </div>
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">Thank You</h2>
              <p className="text-white/80 font-bold text-2xl italic">Any Questions?</p>
              <div className="mt-12 w-20 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        </HTMLFlipBook>
      </div>
    </div>
  );
}

export default BookSlider;
