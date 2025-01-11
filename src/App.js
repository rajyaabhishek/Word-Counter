import { File, FileText, ImageIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
ReactDOM.render(<Router basename={process.env.PUBLIC_URL}>< App /></Router>, document.getElementById('root'));

render() {
    console.log(this.state);
    console.log("This is the process.env", process.env.PUBLIC_URL)
    // debugger
    return (
      <div>
        <Route exact path={`/gameover`} component={GameOver} />
        <Route exact path={`/new`} render={ (routerProps) => < NewUser routerProps={routerProps} />} />
        <Route exact path={`/edit`} render={ (routerProps) => < EditUser routerProps={routerProps} />} />
        <Route exact path={`/home`} render={ (routerProps) => < Home routerProps={routerProps} setUpGame={this.setUpGame} />} />
        <Route exact path={`/gametime`} render={ (routerProps) => < QuestionContainer user1Id={this.state.user1Id} user2Id={this.state.user2Id} gameId={this.state.gameId} routerProps={routerProps}/>} />
      </div>
    );
  }

const App = () => {
  // ... [Previous state and handlers remain the same] ...
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadType, setUploadType] = useState('image');
  const [loadingTypingSpeed, setLoadingTypingSpeed] = useState(false);

  const handleTextAnalysis = (content) => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(content.length);
    setLineCount(content.split('\n').filter(line => line.trim().length > 0).length);
    setParagraphCount(content.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0).length);
  };

  useEffect(() => {
    if (!isProcessingFile) {
      handleTextAnalysis(text);
    }
  }, [text, isProcessingFile]);

  useEffect(() => {
    if (startTime !== null) {
      setLoadingTypingSpeed(true);
      const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - startTime) / 1000;
        setTypingSpeed(wordCount / elapsedTime);
        setLoadingTypingSpeed(false);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, wordCount]);

  const handleTextChange = (e) => {
    if (startTime === null) {
      setStartTime(new Date().getTime());
    }
    setText(e.target.value);
    setIsProcessingFile(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsProcessingFile(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setText(content);
      handleTextAnalysis(content);
      setIsProcessingFile(false);
    };

    reader.onerror = () => {
      setError('Error reading file');
      setIsProcessingFile(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 via-orange-400 to-yellow-300 text-white min-h-screen flex flex-col items-center justify-center p-4">
    <header className="flex items-center justify-center gap-6 mb-8">
      <img
        src="public/ff.png"
        alt="AI Word Counter"
        className="w-16 h-16 rounded-lg drop-shadow-lg"
      />
      <h1 className="text-5xl font-bold text-center text-white drop-shadow-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
       Ai Word Counter
      </h1>
    </header>
 {/* Download Banner */}
    <div className="w-full max-w-5xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-2xl mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src="public/ff.png"
          alt="App Icon"
          className="w-12 h-12 rounded-lg"
        />
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            Download the App!
          </h2>
          <p className="text-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            Get the AI Word Counter app on your Android device.
          </p>
        </div>
      </div>
      <a
        href="https://ai-word-counter.en.uptodown.com/android"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-100 transition-all duration-300"
      >
        <Download className="w-6 h-6" />
        <span className="text-lg font-semibold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          Download Now
        </span>
      </a>
    </div>
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col gap-8">
          <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500 p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              Typing Speed
            </h3>
            <div className="flex items-center justify-center gap-4">
              {loadingTypingSpeed ? (
                <div className="animate-spin mr-2 h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              ) : (
                <p className="text-4xl font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  {typingSpeed.toFixed(1)}
                </p>
              )}
              <div className="flex items-center">
                <span className="text-2xl" style={{ fontFamily: 'Comic Sans MS, cursive' }}>WPM</span>
                <div className="ml-2 flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              <File className="inline mr-2 mb-1" /> Enter Your Text:
            </label>
            <textarea
              className="w-full h-60 p-6 bg-white/20 text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300 text-lg"
              value={text}
              onChange={handleTextChange}
              placeholder="Type or paste your text here..."
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-4 mb-2">
              <button
                onClick={() => setUploadType('image')}
                className={`flex-1 p-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  uploadType === 'image' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/20 hover:bg-blue-500/50'
                }`}
              >
                <ImageIcon className="w-6 h-6" />
                <span style={{ fontFamily: 'Comic Sans MS, cursive' }}>Upload Image</span>
              </button>
              <button
                onClick={() => setUploadType('document')}
                className={`flex-1 p-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  uploadType === 'document' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/20 hover:bg-blue-500/50'
                }`}
              >
                <FileText className="w-6 h-6" />
                <span style={{ fontFamily: 'Comic Sans MS, cursive' }}>Upload Document</span>
              </button>
            </div>

            <div className="flex flex-col">
              <input
                type="file"
                accept={uploadType === 'image' 
                  ? "image/*" 
                  : ".pdf,.doc,.docx,.ppt,.pptx"}
                className="w-full p-4 bg-white/20 text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300"
                onChange={handleFileUpload}
              />
              {isProcessingFile && (
                <div className="mt-4 flex items-center">
                  <div className="animate-spin mr-2 h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  <p className="text-blue-200">Processing file...</p>
                </div>
              )}
              {error && (
                <p className="mt-2 text-red-400">{error}</p>
              )}
              {imagePreview && uploadType === 'image' && (
                <div className="mt-4">
                  <p className="text-xl font-semibold mb-2">Image Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Uploaded preview" 
                    className="max-w-full h-auto rounded-xl max-h-48 object-contain bg-white/20"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3 text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Words</h3>
              <p className="text-4xl font-bold text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>{wordCount}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3 text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Characters</h3>
              <p className="text-4xl font-bold text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>{charCount}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3 text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Lines</h3>
              <p className="text-4xl font-bold text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>{lineCount}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3 text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>Paragraphs</h3>
              <p className="text-4xl font-bold text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>{paragraphCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
