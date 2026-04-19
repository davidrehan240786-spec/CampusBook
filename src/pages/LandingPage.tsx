// coderabbit full review trigger

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI';
import { Book, ArrowRight, ShoppingBag, PlusCircle, Activity, Play, Users, Shield, TrendingUp, MessageSquare, LogOut, User } from 'lucide-react';

import { getCurrentUser, logout, isLoggedIn } from '../lib/auth';

export const LandingPage = () => {
  const user = getCurrentUser();
  const authenticated = isLoggedIn();

  return (
    <div className="min-h-screen bg-background text-dark selection:bg-secondary">
      {/* Navigation */}
      <nav className="w-full px-4 py-8 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b-2 border-dark/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary border-2 border-dark rounded-xl flex items-center justify-center text-white shadow-[3px_3px_0_0_rgba(25,26,35,1)]">
            <Book size={24} />
          </div>
          <Link to="/" className="font-black text-2xl tracking-tighter hover:text-primary transition-colors">CampusBook</Link>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 font-bold text-sm">
          <Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#reviews" className="hover:text-primary transition-colors">Reviews</a>
          <a href="#cta" className="hover:text-primary transition-colors">CTA</a>
          {authenticated && user.role === 'user' && (
            <>
              <Link to="/sell" className="hover:text-primary transition-colors">Sell Books</Link>
              <Link to="/activity" className="hover:text-primary transition-colors">Activity</Link>
              <Link to="/chat" className="hover:text-primary transition-colors">Chatbox</Link>
            </>
          )}
          {authenticated && user.role === 'admin' && (
            <>
              <Link to="/admin/listings" className="hover:text-primary transition-colors">All Listings</Link>
              <Link to="/admin/users" className="hover:text-primary transition-colors">Users</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!authenticated ? (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="outline" className="rounded-xl px-6 font-bold border-dark">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-xl px-6 font-bold bg-dark text-white hover:bg-dark/90 shadow-[4px_4px_0_0_#778667]">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/marketplace">
                <Button className="hidden sm:flex rounded-xl px-6 font-bold bg-secondary text-dark border-2 border-dark shadow-[4px_4px_0_0_rgba(25,26,35,1)] flex items-center gap-2">
                  <ShoppingBag size={18} /> Enter App
                </Button>
              </Link>
              <Button 
                onClick={logout}
                variant="outline" 
                className="rounded-xl px-4 font-bold border-dark flex items-center gap-2 text-zinc-500 hover:text-red-500 hover:border-red-500 transition-colors"
              >
                <LogOut size={18} /> Logout
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full px-4 pt-16 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#191A23_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10"></div>

        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="inline-block bg-secondary border-2 border-dark px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-[2px_2px_0_0_rgba(25,26,35,1)]">
            #1 Student Marketplace
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-8">
            Exchange Book <br />
            <span className="bg-secondary px-2 rounded-xl">On Your Campus</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 mb-10 leading-relaxed font-medium">
            A campus-based platform where students within the same college can exchange books easily. Find textbooks, novels, and study guides from peers on your campus instantly.
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            <Link to="/marketplace">
              <Button className="h-16 px-10 text-lg rounded-2xl bg-dark text-white hover:bg-dark/90 shadow-[6px_6px_0_0_#778667] flex items-center gap-3 group">
                Explore Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Main Hero Image */}
          <div className="relative z-10 rounded-[60px] border-4 border-dark overflow-hidden shadow-[20px_20px_0_0_rgba(119,134,103,0.3)]">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
              alt="Students studying" 
              className="w-full h-[500px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Floating Badges */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 z-20 bg-white border-2 border-dark p-4 rounded-2xl shadow-[4px_4px_0_0_rgba(25,26,35,1)] flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-dark">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-dark">10k+</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase">Active Students</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-1/2 -left-10 z-20 bg-white border-2 border-dark p-4 rounded-2xl shadow-[4px_4px_0_0_rgba(25,26,35,1)] flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-dark">500+</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase">Daily Listings</p>
            </div>
          </motion.div>

          {/* Decorative background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-2 border-dark border-dashed rounded-full -z-0 opacity-20 animate-spin-slow"></div>
        </motion.div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="w-full px-4 py-32">
        <div className="flex flex-col md:flex-row md:items-center gap-10 mb-20">
          <h2 className="text-3xl md:text-4xl font-black bg-secondary border-2 border-dark px-6 py-2 rounded-2xl shadow-[4px_4px_0_0_rgba(25,26,35,1)]">Features</h2>
          <p className="text-lg text-zinc-500 font-medium">
            Everything you need to manage your campus book exchange in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Campus Discovery - Large */}
          <div className="md:col-span-4 positivus-card-green flex flex-col md:flex-row justify-between items-center group cursor-pointer overflow-hidden">
            <div className="space-y-10 z-10">
              <h3 className="text-2xl md:text-3xl font-black leading-tight">
                <span className="bg-white px-2 rounded-lg border-2 border-dark">Campus-Based</span><br />
                Matching
              </h3>
              <p className="text-zinc-600 font-medium max-w-xs">
                Browse thousands of books listed by students on your specific campus. Filter by college, subject, and condition.
              </p>
              <div className="flex items-center gap-4 font-bold text-xl group-hover:translate-x-2 transition-transform">
                <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center text-secondary">
                  <ArrowRight size={24} />
                </div>
                <span>Explore Marketplace</span>
              </div>
            </div>
            <div className="relative mt-10 md:mt-0">
              <ShoppingBag size={240} className="text-dark/5 group-hover:text-dark/10 transition-colors absolute -right-20 -bottom-20" />
              <div className="bg-white p-4 rounded-2xl border-2 border-dark shadow-[8px_8px_0_0_rgba(25,26,35,1)] rotate-6 group-hover:rotate-0 transition-transform">
                <img src="https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=300" alt="Book" className="w-40 h-56 object-cover rounded-lg" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>

          {/* Sell Books - Small */}
          <div className="md:col-span-2 positivus-card flex flex-col justify-between group cursor-pointer">
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-black leading-tight">
                <span className="bg-secondary px-2 rounded-lg border-2 border-dark">Sell Books</span><br />
                Instantly
              </h3>
              <p className="text-zinc-500 text-sm font-medium">
                Turn your old textbooks into cash in minutes.
              </p>
            </div>
            <div className="flex items-center justify-between mt-10">
              <div className="w-16 h-16 bg-primary rounded-2xl border-2 border-dark flex items-center justify-center text-white shadow-[4px_4px_0_0_rgba(25,26,35,1)]">
                <PlusCircle size={32} />
              </div>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </div>
          </div>

          {/* Activity Tracking - Small */}
          <div className="md:col-span-2 positivus-card-dark flex flex-col justify-between group cursor-pointer">
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-black leading-tight">
                <span className="bg-white text-dark px-2 rounded-lg border-2 border-dark">Activity</span><br />
                Tracking
              </h3>
              <p className="text-zinc-400 text-sm font-medium">
                Monitor your sales, purchases, and chat history.
              </p>
            </div>
            <div className="flex items-center justify-between mt-10">
              <div className="w-16 h-16 bg-white rounded-2xl border-2 border-dark flex items-center justify-center text-dark shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]">
                <Activity size={32} />
              </div>
              <ArrowRight className="text-white group-hover:translate-x-2 transition-transform" />
            </div>
          </div>

          {/* Secure Chatbox - Large */}
          <div className="md:col-span-4 positivus-card-green flex flex-col md:flex-row justify-between items-center group cursor-pointer overflow-hidden">
             <div className="relative mb-10 md:mb-0">
              <MessageSquare size={240} className="text-dark/5 group-hover:text-dark/10 transition-colors absolute -left-20 -bottom-20" />
              <div className="bg-dark p-6 rounded-3xl border-2 border-white shadow-[8px_8px_0_0_rgba(119,134,103,1)] -rotate-6 group-hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-secondary rounded-full border border-white"></div>
                  <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-32 bg-secondary rounded-full"></div>
                  <div className="h-3 w-20 bg-white/10 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-10 z-10 text-right md:text-left">
              <h3 className="text-2xl md:text-3xl font-black leading-tight">
                <span className="bg-white px-2 rounded-lg border-2 border-dark">Secure</span><br />
                Chatbox
              </h3>
              <p className="text-zinc-600 font-medium max-w-xs ml-auto md:ml-0">
                Communicate directly with buyers and sellers through our encrypted messaging system.
              </p>
              <div className="flex items-center gap-4 font-bold text-xl justify-end md:justify-start group-hover:translate-x-2 transition-transform">
                <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center text-secondary">
                  <ArrowRight size={24} />
                </div>
                <span>Start Chatting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="bg-dark py-32 overflow-hidden">
        <div className="w-full px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-white bg-primary border-2 border-white px-6 py-2 rounded-2xl shadow-[4px_4px_0_0_rgba(217,230,202,1)]">Testimonials</h2>
            <p className="text-lg text-zinc-400 font-medium">
              Hear from students who have transformed their campus experience with CampusBook.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah J.', role: 'Senior, Psychology', text: '"I saved over $300 on my textbooks this semester. The chatbox made it so easy to coordinate a meetup on campus."' },
              { name: 'Michael R.', role: 'Sophomore, CS', text: '"Selling my old books was a breeze. I listed them in between classes and had a buyer by the end of the day."' },
              { name: 'Emily W.', role: 'Freshman, Arts', text: '"As a new student, CampusBook helped me connect with upperclassmen and get the best deals on my required reading."' }
            ].map((t, i) => (
              <div key={i} className="border-2 border-primary p-10 rounded-[45px] relative group hover:bg-primary/10 transition-colors">
                <div className="absolute -top-4 -left-4 bg-secondary border-2 border-dark px-4 py-1 rounded-full text-xs font-black text-dark">
                  Student Account
                </div>
                <p className="text-white text-lg font-medium mb-8 italic">
                  {t.text}
                </p>
                <div>
                  <p className="text-primary font-black text-xl">{t.name}</p>
                  <p className="text-zinc-500 text-sm font-bold">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="w-full px-4 py-32">
        <div className="flex flex-col md:flex-row md:items-center gap-10 mb-20">
          <h2 className="text-3xl md:text-4xl font-black bg-secondary border-2 border-dark px-6 py-2 rounded-2xl shadow-[4px_4px_0_0_rgba(25,26,35,1)]">How it Works</h2>
          <p className="text-lg text-zinc-500 font-medium">
            Simple steps to get started with your first book exchange.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { step: '01', title: 'Join Your Campus', desc: 'Be part of your campus book exchange network and connect with fellow students..', icon: <Users size={40} /> },
            { step: '02', title: 'Find Local Books', desc: 'Browse books within the same campus or post your own with photos and details.', icon: <ShoppingBag size={40} /> },
            { step: '03', title: 'Meet & Exchange', desc: 'Chat with peers and meet within campus premises for a safe and easy exchange.', icon: <MessageSquare size={40} /> }
          ].map((item, idx) => (
            <div key={idx} className="positivus-card flex flex-col gap-8 relative overflow-hidden group">
              <span className="text-9xl font-black text-dark/5 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform duration-500">{item.step}</span>
              <div className="w-20 h-20 bg-secondary border-2 border-dark rounded-2xl flex items-center justify-center text-dark shadow-[4px_4px_0_0_rgba(25,26,35,1)]">
                {item.icon}
              </div>
              <div className="z-10">
                <h4 className="text-2xl font-black mb-4">{item.title}</h4>
                <p className="text-zinc-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join the Community Section */}
      <section className="py-32 bg-background overflow-hidden">
        <div className="w-full px-4 mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <h2 className="text-3xl md:text-4xl font-black bg-white border-2 border-dark px-6 py-2 rounded-2xl shadow-[4px_4px_0_0_rgba(25,26,35,1)]">Join the Community</h2>
            <p className="text-lg text-zinc-500 font-medium">
              Connect with thousands of students from top universities across the country.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Row 1 */}
          <div className="flex whitespace-nowrap">
            <motion.div 
              animate={{ x: [0, -1000] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-6 items-center px-6"
            >
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-20 h-20 rounded-2xl border-2 border-dark overflow-hidden shadow-[4px_4px_0_0_rgba(25,26,35,1)] flex-shrink-0">
                  <img src={`https://picsum.photos/seed/${i + 10}/200/200`} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </motion.div>
            <motion.div 
              animate={{ x: [0, -1000] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-6 items-center px-6"
            >
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-20 h-20 rounded-2xl border-2 border-dark overflow-hidden shadow-[4px_4px_0_0_rgba(25,26,35,1)] flex-shrink-0">
                  <img src={`https://picsum.photos/seed/${i + 10}/200/200`} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 2 */}
          <div className="flex whitespace-nowrap">
            <motion.div 
              animate={{ x: [-1000, 0] }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="flex gap-6 items-center px-6"
            >
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-20 h-20 rounded-2xl border-2 border-dark overflow-hidden shadow-[4px_4px_0_0_rgba(25,26,35,1)] flex-shrink-0">
                  <img src={`https://picsum.photos/seed/${i + 20}/200/200`} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </motion.div>
            <motion.div 
              animate={{ x: [-1000, 0] }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="flex gap-6 items-center px-6"
            >
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-20 h-20 rounded-2xl border-2 border-dark overflow-hidden shadow-[4px_4px_0_0_rgba(25,26,35,1)] flex-shrink-0">
                  <img src={`https://picsum.photos/seed/${i + 20}/200/200`} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta" className="w-full py-20">
        <div className="bg-secondary border-y-4 border-dark px-8 md:px-24 py-16 md:py-24 relative overflow-hidden shadow-none grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black leading-tight mb-8">
              Ready to start your <br />
              <span className="bg-white px-3 rounded-2xl border-2 border-dark">exchange?</span>
            </h2>
            <p className="text-xl text-dark/70 font-medium mb-12 max-w-lg">
              Join thousands of students on your campus who are already saving money and building their libraries.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/login">
                <Button className="h-16 px-12 text-xl rounded-2xl bg-dark text-white hover:bg-dark/90 shadow-[6px_6px_0_0_#778667] flex items-center gap-3">
                  Get Started Now
                  <ArrowRight />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" className="h-16 px-12 text-xl rounded-2xl border-2 border-dark font-black hover:bg-white/50">
                  Browse Books
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="relative hidden lg:flex justify-center items-center h-full">
            <div className="relative">
              <div className="w-[400px] h-[400px] bg-primary/20 rounded-full border-2 border-dark border-dashed animate-spin-slow"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white border-4 border-dark rounded-[40px] shadow-[15px_15px_0_0_rgba(25,26,35,1)] flex items-center justify-center">
                <Book size={100} className="text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white pt-20 pb-12 mt-32 relative overflow-hidden">
        <div className="w-full px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-16">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary border-2 border-white rounded-xl flex items-center justify-center text-white shadow-[3px_3px_0_0_rgba(255,255,255,0.1)]">
                  <Book size={24} />
                </div>
                <span className="font-black text-2xl tracking-tighter">CampusBook</span>
              </div>
              <p className="text-zinc-500 font-medium leading-relaxed max-w-sm">
                Empowering students to build their personal libraries and share knowledge within campus communities.
              </p>
            </div>

            {/* Marketplace Column */}
            <div>
              <h4 className="text-sm font-black mb-6 uppercase tracking-widest text-secondary">Marketplace</h4>
              <ul className="space-y-3 font-bold text-zinc-400 text-sm">
                <li><Link to="/marketplace" className="hover:text-primary transition-colors">Browse Books</Link></li>
                <li><Link to="/sell" className="hover:text-primary transition-colors">Sell Textbooks</Link></li>
                <li><Link to="/marketplace" className="hover:text-primary transition-colors">Study Guides</Link></li>
              </ul>
            </div>

            {/* Connect Column */}
            <div>
              <h4 className="text-sm font-black mb-6 uppercase tracking-widest text-secondary">Connect</h4>
              <ul className="space-y-3 font-bold text-zinc-400 text-sm">
                <li><Link to="/activity" className="hover:text-primary transition-colors">Recent Activity</Link></li>
                <li><Link to="/chat" className="hover:text-primary transition-colors">Messages</Link></li>
                <li><Link to="/profile" className="hover:text-primary transition-colors">Member Profile</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-zinc-600 font-medium text-xs">© 2026 CampusBook Platform. Built for students.</p>
            <div className="flex gap-6 text-xs font-bold text-zinc-600">
              <span className="flex items-center gap-2"><Shield size={14} /> Secure Access</span>
              <span className="flex items-center gap-2"><Users size={14} /> Verified Campus</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
