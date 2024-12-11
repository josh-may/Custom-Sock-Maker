import React from "react";
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = React.useState("");
  const [sockImages, setSockImages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);

  const generateSockImage = async () => {
    setIsLoading(true);
    setSelectedImage(null);
    setSockImages([]);
    try {
      const promises = Array(4)
        .fill(null)
        .map(() =>
          fetch("/api/dalle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: `${prompt}

Keep the image simple. Make it look like a mock up. Make it 2D. Only output the sock. Use a white background. 
`,
            }),
          }).then((res) => res.json())
        );

      const responses = await Promise.all(promises);
      setSockImages(responses.map((response) => response.urls[0]));
      setSelectedImage(null);
    } catch (error) {
      console.error("Error generating sock:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {/* Design Input Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border-2 border-gray-200">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Design Your Custom Socks
            </h1>
            <div className="space-y-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream sock design..."
                className="w-full border-2 border-gray-200 rounded-lg p-4 text-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <div>
                <button
                  onClick={generateSockImage}
                  disabled={isLoading || !prompt.trim()}
                  className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-all disabled:bg-gray-200 disabled:cursor-not-allowed font-bold text-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Generating your designs...</span>
                    </span>
                  ) : (
                    "Get Free Custom Designs"
                  )}
                </button>
              </div>
            </div>
          </div>
          {/*  */}
          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border-2 border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Your Designs
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-50 rounded-lg border-2 border-gray-200 flex items-center justify-center"
                  >
                    <div className="animate-pulse text-gray-400 text-sm">
                      Generating...
                    </div>
                  </div>
                ))
              ) : sockImages.length > 0 ? (
                sockImages.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square bg-white rounded-lg relative cursor-pointer transition-all border-2 ${
                      selectedImage === index
                        ? "border-red-500 ring-2 ring-red-500"
                        : "border-gray-200 hover:border-red-400"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image}
                      alt={`Sock design ${index + 1}`}
                      fill
                      priority
                      className="p-3"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full aspect-[3/2] bg-gray-50 rounded-lg border-2 border-gray-200 flex flex-col items-center justify-center p-8 text-center">
                  <svg
                    className="w-16 h-16 mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <p className="text-lg font-medium text-gray-900">
                    Ready to create your custom socks?
                  </p>
                  <p className="text-gray-500 mt-2">
                    Enter your design idea above to get started
                  </p>
                </div>
              )}
            </div>
            {selectedImage !== null && (
              <div className="text-center text-gray-600 font-medium mt-4">
                Design {selectedImage + 1} selected
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
