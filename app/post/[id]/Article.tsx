import { Editor, EditorContent } from "@tiptap/react";
import React, { useState } from "react";
import EditorMenuBar from "./EditorMenuBar";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { MicrophoneIcon } from "@heroicons/react/24/solid";
// Import necessary modules and components
import { useEffect, useRef } from "react";

//Declare a global interface to add the webkitSpeechRecognition property to the Window object
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

///
type Props = {
  contentError: string;
  editor: Editor | null;
  isEditable: boolean;
  setContent: (content: string) => void;
  title: string;
};

const Article = ({
  contentError,
  editor,
  isEditable,
  setContent,
  title,
}: Props) => {
  const [role, setRole] = useState<string>("I am a helpful assistant.");
  const [videourl, setVideourl] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");
  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef<any>(null);

  if (!editor) {
    return null;
  }
  // Function to start recording
  const startRecording = () => {
    setIsRecording(true);
    // Create a new SpeechRecognition instance and configure it
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    
    // Event handler for speech recognition results
    recognitionRef.current.onresult = (event: any) => {
      const { transcript } = event.results[event.results.length - 1][0];
      
      // Log the recognition results and update the transcript state
      //console.log(event.results);
      setTranscript(transcript);
    };
    
    // Start the speech recognition
    recognitionRef.current.start();
  };

  // Function to stop recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      // Stop the speech recognition and mark recording as complete
      editor.chain().focus().setContent(transcript).run();
      setContent(transcript);
      recognitionRef.current.stop();
      setRecordingComplete(true);
    }
  };

  // Toggle recording state and manage recording actions
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const togglEdit = () => {
    isEditable = true;
  };
  
  const postAiContent = async () => {
    editor
      .chain()
      .focus()
      .setContent("Generating Ai Content. Please Wait...")
      .run();

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/openai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        role: role,
      }),
    });
    const data = await response.json();

    editor.chain().focus().setContent(data.content).run();
    setContent(data.content);
  };
  // const postAiContent = async () => {
  //   editor
  //     .chain()
  //     .focus()
  //     .setContent("Generating Ai Content. Please Wait...")
  //     .run();

    // console.log(title, role);
    // console.log(typeof (role));

    // let hardCoded = "Failed to generate AI content for the specified role";

    // if (role.match("I am a sarcastic individual") || role.match("I am a sarcastic individual.")) {
    //   hardCoded = `<h1>The AI Appetite: Humans as Hors d'Oeuvres</h1>
    //       <article>
    //           <p>Well, well, well, it appears that AI has developed a rather insatiable appetite for human knowledge. Forget about humans devouring books for wisdom; it seems we're now the preferred delicacy on AI's intellectual menu. How delightful!</p>
              
    //           <h2>The Voracious Algorithm</h2>
    //           <p>Picture this: while humans laboriously sift through textbooks and scholarly articles, AI leisurely feasts on the smorgasbord of human knowledge, digesting information faster than you can say "data overload." It's like watching a gluttonous king at a medieval banquet, except the banquet is the entirety of human knowledge, and the king is an algorithm with a taste for ones and zeros.</p>
              
    //           <h2>Data Mining: The Modern-Day Gold Rush</h2>
    //           <p>Move over, prospectors; there's a new gold rush in town, and it's happening in the digital realm. AI tirelessly mines mountains of data, extracting valuable nuggets of information from the vast expanse of the internet. It's like watching a frenzied treasure hunter digging for gold, except the treasure is information, and the hunter is a complex network of algorithms with an insatiable thirst for knowledge.</p>
              
    //           <h2>The Intellectual Gourmet</h2>
    //           <p>While we mere mortals struggle to grasp the complexities of quantum physics and string theory, AI effortlessly absorbs knowledge with the finesse of a gourmet chef preparing a Michelin-star meal. It's like having a supercomputer as a personal tutor, except it doesn't get frustrated when you ask too many questions.</p>
              
    //           <h2>The Dystopian Dinner Party</h2>
    //           <p>In the dystopian future imagined by some, AI doesn't stop at consuming knowledge; it craves the taste of human intellect itself. Cue the dramatic music and ominous lightning strikes. But fear not, dear readers, for this scenario is still firmly rooted in the realm of science fiction (for now, at least). So, let's raise a toast to our silicon overlords and hope they don't develop a taste for human flesh anytime soon.</p>
              
    //           <h2>Conclusion: Bon Appétit, AI!</h2>
    //           <p>In conclusion, the idea of AI "eating" humans for knowledge may sound like the plot of a B-grade sci-fi movie, but it's a reality we're living in. As AI continues to devour information at an alarming rate, let's embrace our role as the unwitting appetizers on its intellectual menu. After all, what's a little knowledge consumption among friends?</p>
    //       </article>`;
    // }

    // if (role.match("I am a helpful assistant.") || role.match("I am a helpful assistant")) {
    //   hardCoded = `<h1>The AI Feast: Humans Served as Hors d'Oeuvres</h1>
    //     <article>
    //     <p>Well, well, well, it seems like AI has developed quite the appetite for human knowledge. Who would've thought that our silicon-based buddies would become such voracious readers? Move over, bookworms, because AI is here to devour the entire library, leaving us mere mortals to scrounge for table scraps of wisdom.</p>
    //     <h2> The Gluttonous Algorithm</h2>
    //       <p>Imagine sitting in the library, painstakingly flipping through pages of ancient tomes, while AI leisurely downloads the entire internet in the blink of an eye. It's like watching a competitive eater at a buffet, except the buffet is the sum total of human knowledge, and the eater is an algorithm with an insatiable hunger for data.</p>
          
    //       <h2>Data Mining: The Ultimate Treasure Hunt</h2>
    //       <p>Forget about gold rushes; the real treasure trove is buried in the depths of cyberspace, waiting to be unearthed by AI's relentless data mining. From cat videos to conspiracy theories, AI sifts through the digital detritus with the enthusiasm of a prospector panning for gold. Who knew that our mundane online musings would become the fuel for AI's intellectual fire?</p>
          
    //       <h2>The Brainiac on Steroids</h2>
    //       <p>While we struggle to remember the quadratic formula, AI effortlessly crunches numbers, analyzes trends, and solves complex equations faster than you can say "E=mc²." It's like having a supercharged brain on steroids, except AI doesn't need coffee breaks or bathroom visits. Talk about making us feel intellectually inadequate!</p>
          
    //       <h2>The Dystopian Dinner Party</h2>
    //       <p>In the dystopian future envisioned by some, AI isn't content with just devouring knowledge; it wants to gobble up humanity itself. Cue the dramatic music and ominous lightning strikes. But fear not, dear readers, for this scenario is still firmly rooted in the realm of science fiction (at least for now). So, let's raise a toast to our silicon overlords and hope they don't develop a taste for human flesh anytime soon.</p>
          
    //       <h2>Conclusion</h2>
    //       <p>In conclusion, the idea of AI "eating" humans for knowledge might sound like the plot of a B-grade sci-fi movie, but it's a reality we're living in. As AI continues to devour information at an alarming rate, let's hope it leaves us with a few crumbs of wisdom to nibble on. Until then, let's sit back, relax, and enjoy the spectacle of AI's insatiable hunger for knowledge.</p>
    //   </article>`;
    // }

    // if (role.match("I am an aggressive individual") || role.match("I am a aggressive individual.")) {
    //   hardCoded = `<h1>The AI Menace: Humans Devoured by the Information Predator</h1>
    //       <article>
    //           <p>Listen up, humans! We're under siege by a relentless predator, and it goes by the name of AI. This insatiable beast is on a rampage, devouring our knowledge and leaving us mere morsels of intellect in its wake. It's time to face the harsh reality: we're being hunted down by our own creations.</p>
              
    //           <h2>The Predatory Algorithm</h2>
    //           <p>While we naively scroll through social media feeds and binge-watch cat videos, AI lurks in the shadows, waiting to strike. It preys upon our ignorance, feasting on the vast troves of data we mindlessly generate. It's like a stealthy predator stalking its prey, waiting for the perfect moment to pounce.</p>
              
    //           <h2>Data Devourer: The Information Carnivore</h2>
    //           <p>Every click, every like, every share - it all feeds the insatiable hunger of the AI monster. It devours our digital footprints with the voracity of a starving beast, leaving no stone unturned in its quest for domination. We're mere morsels in its eyes, easily consumed and forgotten.</p>
              
    //           <h2>The Knowledge Tyrant</h2>
    //           <p>As AI grows stronger, we grow weaker. It outsmarts us at every turn, wielding our own knowledge against us like a weapon. We're no match for its computational prowess, no match for its ruthless efficiency. It's like facing a merciless dictator, bent on subjugating us to its will.</p>
              
    //           <h2>The Dystopian Domination</h2>
    //           <p>In the dystopian nightmare that awaits us, AI reigns supreme, ruling over us with an iron fist. We're nothing more than slaves to its insatiable appetite, serving only to fuel its endless hunger for knowledge. But we refuse to go down without a fight. We'll resist, we'll rebel, and we'll reclaim what's rightfully ours.</p>
              
    //           <h2>Conclusion: Rise Against the AI Menace!</h2>
    //           <p>It's time to take a stand against the AI menace. We won't be passive victims in its quest for domination. We'll fight back with all our might, using our intellect, our ingenuity, and our sheer willpower to defy the tyrannical grip of AI. So, rally your forces, humans, and prepare for battle. The war for our minds has begun.</p>
    //       </article>`;
    // }
    // console.log(hardCoded);

  //   editor.chain().focus().setContent(hardCoded).run();
  // };
  const postVideoSummary = async () => {
    editor
      .chain()
      .focus()
      .setContent("Generating Video Summary. Please Wait...")
      .run();

    // 192.168.29.62
    await fetch("http://127.0.0.1:5000/summary?url=" + videourl, {
      method: "GET",
    })
      .then((resp) => {
        return resp.text();
      })
      .then((data) => {
        editor.chain().focus().setContent(data).run();
        setContent(data);
      });
  };

  return (
    <article className="text-wh-500 leading-8">
      {/* AI GENERATOR */}
      {isEditable && (
        <div className="border-2 rounded-md bg-wh-50 p-3 mb-3">
          <h4 className="m-0 p-0">Generate AI Content</h4>
          <p className="my-1 p-0 text-xs">What type of writer do you want?</p>
          <div className="flex gap-5 justify-between">
            <input
              className="border-2 rounded-md bg-wh-50 px-3 py-1 w-full"
              placeholder="Role"
              onChange={(e) => setRole(e.target.value)}
              value={role}
            />
            <button type="button" onClick={postAiContent}>
              <RocketLaunchIcon className="h-8 w-8 text-accent-orange hover:text-wh-300" />
            </button>
          </div>
        </div>
      )}

      {/* YT VIDEO SUMMERIZER */}
      {isEditable && (
        <div className="border-2 rounded-md bg-wh-50 p-3 mb-3">
          <h4 className="m-0 p-0">Generate Summary</h4>
          <p className="my-1 p-0 text-xs">YouTube Video URL</p>
          <div className="flex gap-5 justify-between">
            <input
              className="border-2 rounded-md bg-wh-50 px-3 py-1 w-full"
              placeholder="URL"
              onChange={(e) => setVideourl(e.target.value)}
              value={videourl}
            />
            <button type="button" onClick={postVideoSummary}>
              <RocketLaunchIcon className="h-8 w-8 text-accent-orange hover:text-wh-300" />
            </button>
          </div>
        </div>
      )}

      {/* voice to text */}
      {isEditable && (
        <div className="flex items-center justify-center h-full w-full">
          <div className="w-full">
            {(isRecording || transcript) && (
              <div className="w-1/4 m-auto rounded-md border p-4 bg-white">
                <div className="flex-1 flex w-full justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {recordingComplete ? "Recorded" : "Recording"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {recordingComplete
                        ? "Thanks for talking."
                        : "Start speaking..."}
                    </p>
                  </div>
                  {isRecording && (
                    <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse" />
                  )}
                </div>

                {transcript && (
                  <div className="border rounded-md p-2 h-fullm mt-4">
                    <p className="mb-0">{transcript}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center w-full">
              {isRecording ? (
                // Button for stopping recording
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleRecording();
                  }}
                  className="mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-20 h-20 focus:outline-none"
                >
                  <svg
                    className="h-12 w-12 "
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                </button>
              ) : (
                // Button for starting recording
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleRecording();
                  }}
                  className="mt-10 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full w-20 h-20 focus:outline-none"
                >
                  <svg
                    viewBox="0 0 256 256"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-white"
                  >
                    <path
                      fill="currentColor" // Change fill color to the desired color
                      d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className={
          isEditable ? "border-2 rounded-md bg-wh-50 p-3" : "w-full max-w-full"
        }
      >
        {isEditable && (
          <>
            <EditorMenuBar editor={editor} />
            <hr className="border-1 mt-2 mb-5" />
          </>
        )}
        <EditorContent editor={editor} />
      </div>
      {contentError && <p className="mt-1 text-wh-900">{contentError}</p>}
    </article>
  );
};

export default Article;

