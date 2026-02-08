import Navbar from "@/components/Navbar";

export const metadata = {
  title: "FAQ & Help - Movie DB",
  description: "Frequently asked questions and guides for Movie DB.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 mt-12">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 text-center">
          Help & <span className="text-yellow-500">FAQ</span>
        </h1>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Guides, tips, and answers to common questions.
        </p>

        <div className="space-y-12">
          
          {/* --- SECTION 1: GETTING STARTED --- */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-widest border-b border-gray-800 pb-4 mb-6 text-yellow-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Getting Started
            </h2>
            <div className="space-y-4">
              <FaqItem question="Is this app free?">
                Yes, this is a personal movie database project. It is completely free to use for browsing, tracking, and requesting media.
              </FaqItem>
              <FaqItem question="Where does the data come from?">
                All movie and TV show data, including posters, cast lists, and release dates, is provided by <a href="https://www.themoviedb.org/" target="_blank" className="text-yellow-500 hover:underline">TMDB (The Movie Database)</a>. Streaming availability is provided by JustWatch (via TMDB).
              </FaqItem>
              <FaqItem question="Do I need an account?">
                You can browse popular, top-rated, and new movies without an account. However, you need to <strong>Log In</strong> to use features like the Watchlist, Logging/Reviews, and Requests.
              </FaqItem>
            </div>
          </section>

          {/* --- SECTION 2: FEATURES --- */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-widest border-b border-gray-800 pb-4 mb-6 text-yellow-500 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Features & How-To
            </h2>
            <div className="space-y-4">
              <FaqItem question="How do I log a movie or show I've watched?">
                <ol className="list-decimal pl-5 space-y-2 text-gray-300">
                  <li>Navigate to the page of the movie or TV show.</li>
                  <li>Click the <strong>"LOG / REVIEW"</strong> button.</li>
                  <li>Select the date you watched it.</li>
                  <li>Optionally add a Star Rating (1-5) and a written review.</li>
                  <li>Click "Save Log". This adds it to your <a href="/log" className="text-yellow-500 hover:underline">Watch History</a>.</li>
                </ol>
              </FaqItem>

              <FaqItem question="What happens when I rate/review a movie again?">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                   <li><strong>Logging:</strong> You can log a movie multiple times (e.g., re-watches). Every log is saved in your history.</li>
                   <li><strong>Reviews:</strong> You only have <em>one</em> active review/rating per movie. If you log it again with a new review, it overwrites your previous review text/rating for that title, but keeps the old log date in your history.</li>
                </ul>
              </FaqItem>

              <FaqItem question="How does the Watchlist work?">
                Click the <strong>"+ WATCHLIST"</strong> button on any movie or show to save it for later. You can view your list by clicking "Watchlist" in the navigation menu. 
                <br/><br/>
                <em>Note: Logging a movie as watched will automatically remove it from your Watchlist.</em>
              </FaqItem>

              <FaqItem question="How do I request a movie/show?">
                If a movie is missing or not available on the server yet, click the <strong>"REQUEST"</strong> button on its page. The admin will be notified to add it. You can track the status of your requests (Pending/Approved/Available) on your Profile page.
              </FaqItem>
            </div>
          </section>

          {/* --- SECTION 3: INSTALLATION --- */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-widest border-b border-gray-800 pb-4 mb-6 text-yellow-500 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Install as App
            </h2>
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 mb-8 text-center">
              <p className="text-gray-300 leading-relaxed font-medium">
                Install this website to your home screen for a full-screen, native app experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               {/* iPhone */}
               <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
                     <span className="text-2xl"></span> iPhone / iPad
                  </h3>
                  <ol className="list-decimal pl-5 space-y-3 text-gray-400 text-sm">
                    <li>Open this site in <strong>Safari</strong>.</li>
                    <li>Tap the <strong>Share</strong> icon (square with arrow up) at the bottom.</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                    <li>Tap <strong>Add</strong> (top right).</li>
                  </ol>
               </div>

               {/* Android */}
               <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
                     <span className="text-2xl">🤖</span> Android
                  </h3>
                  <ol className="list-decimal pl-5 space-y-3 text-gray-400 text-sm">
                    <li>Open this site in <strong>Chrome</strong>.</li>
                    <li>Tap the <strong>three dots</strong> menu (top right).</li>
                    <li>Tap <strong>"Install App"</strong> or "Add to Home screen".</li>
                    <li>Confirm by tapping <strong>Install</strong>.</li>
                  </ol>
               </div>
            </div>
          </section>

          {/* --- SECTION 4: ACCOUNT --- */}
          <section>
             <h2 className="text-2xl font-bold uppercase tracking-widest border-b border-gray-800 pb-4 mb-6 text-yellow-500 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account Management
            </h2>
            <div className="space-y-4">
               <FaqItem question="How do I change my password?">
                  Go to your <strong>Profile</strong> (click the avatar in the navbar). Click the "Edit" button next to your details to update your name or password.
               </FaqItem>
               <FaqItem question="Can I delete my account?">
                  Yes. In your Profile settings, there is a "Delete Account" option. 
                  <br/><span className="text-red-400 text-sm font-bold">Warning: This is permanent and will remove all your logs, reviews, and watchlist items.</span>
               </FaqItem>
            </div>
          </section>

        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center text-gray-500 text-sm pb-10 border-t border-gray-800 pt-10">
           <p>Movie DB v2.0 &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}

// Reusable Accordion Component
function FaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <details className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-colors duration-300 open:border-yellow-500 transform-gpu">
      {/* FIXES:
         1. Added 'transform-gpu': Forces hardware acceleration to prevent visual artifacts (diagonal lines).
         2. Removed transparency: 'open:bg-gray-900' is now solid (was /80).
         3. Removed shadow: Eliminates potential banding lines.
         4. Increased Padding: 'p-6' gives the text more room.
      */}
      <summary className="flex items-center justify-between p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-gray-800 transition-colors select-none">
        <span className="font-bold text-lg text-gray-200 group-open:text-yellow-500 transition-colors pr-6 leading-relaxed">
          {question}
        </span>
        <span className="transform group-open:rotate-180 transition-transform duration-300 text-gray-500 group-open:text-yellow-500 text-xl flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </summary>
      
      <div className="px-6 pb-6 pt-0 text-gray-400 leading-relaxed border-t border-gray-800/50 mt-0 pt-4 text-sm md:text-base">
        {children}
      </div>
    </details>
  );
}