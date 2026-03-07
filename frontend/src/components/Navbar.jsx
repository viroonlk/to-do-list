export default function Navbar({ user, searchQuery, setSearchQuery }) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center w-full h-11 rounded-full bg-slate-100 border border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-sm focus-within:ring-4 focus-within:ring-indigo-50 transition-all overflow-hidden">
          <span className="pl-4 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="ค้นหางาน หรือ หมวดหมู่..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full h-full px-3 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">🔔</button>
        <div className="md:hidden flex items-center gap-2">
          <span className="font-bold">{user?.username}</span>
        </div>
      </div>
    </header>
  );
}