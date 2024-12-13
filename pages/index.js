import React from "react";
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = React.useState("");
  const [sockImages, setSockImages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    sockBuilderDesignNotes: "",
  });

  const [attributionData, setAttributionData] = React.useState({
    parentUrl: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
  });

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const currentUrl = params.get("parent_url");

      setAttributionData({
        parentUrl: currentUrl || window.location.href,
        utmSource: params.get("utm_source") || "organic",
        utmMedium: params.get("utm_medium") || "direct",
        utmCampaign: params.get("utm_campaign") || "none",
        utmTerm: params.get("utm_term") || "",
        utmContent: params.get("utm_content") || "",
      });

      // Debug logging
      console.log("URL Parameters:", {
        parent_url: params.get("parent_url"),
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        utm_term: params.get("utm_term"),
        utm_content: params.get("utm_content"),
      });
    } catch (error) {
      console.error("Error parsing URL parameters:", error);
      setAttributionData({
        parentUrl: window.location.href,
        utmSource: "organic",
        utmMedium: "direct",
        utmCampaign: "none",
        utmTerm: "",
        utmContent: "",
      });
    }
  }, []);

  const generateSockImage = async () => {
    setIsLoading(true);
    setSelectedImage(null);
    setSockImages([]);
    try {
      const prompts = [
        `${prompt}
        
        Design a technical illustration style mock-up. Light, professional sketch quality on white background.`,
        `${prompt}
        
        Design a technical illustration style mock-up. Light, professional sketch quality on white background.`,

        `${prompt}
        
        Make a simple sketched mock-up from a 3/4 angle, displayed on a clean white background. Drawn in a casual illustration style.`,
        `${prompt}
        
        Make a simple sketched mock-up from a 3/4 angle, displayed on a clean white background. Drawn in a casual illustration style.`,
      ];

      const imagePromises = prompts.map((promptText) =>
        fetch("/api/fal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptText }),
        }).then((res) => res.json())
      );

      const results = await Promise.all(imagePromises);

      const imageUrls = results.map((result) => result.urls[0]);
      setSockImages(imageUrls);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error generating socks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const zapierData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        sockBuilderDesignNotes: formData.sockBuilderDesignNotes,
        selectedImageUrl: sockImages[selectedImage],
        submissionDate: new Date().toISOString(),
        ...attributionData,
      };
      console.log("zapierData", zapierData);

      const response = await fetch("/api/submit-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zapierData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit design");
      }

      await response.json();

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        sockBuilderDesignNotes: "",
      });
      setShowModal(false);
      alert("Design submitted successfully!");
    } catch (error) {
      console.error("Error details:", error);
      alert("Failed to submit design. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {/* Design Input Section */}
          <div className="bg-gray-50 rounded-md shadow-sm p-6 md:p-8 border border-gray-300">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Design Your Socks
            </h1>
            <div className="space-y-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream sock design..."
                className="w-full border-2 border-gray-200 rounded-lg p-4 text-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <p className="text-sm text-gray-500 italic">
                Example: &ldquo;Generate a Star Trek custom sock and use the
                Star Trek logo and colors on the sock.&rdquo;
              </p>
              <div>
                <button
                  onClick={generateSockImage}
                  disabled={isLoading || !prompt.trim()}
                  className={`text-white font-bold py-3 px-6 rounded-lg transition-all ${
                    isLoading
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } font-bold text-lg`}
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
                    "Generator Design"
                  )}
                </button>
              </div>
            </div>
          </div>
          {/*  */}
          {/* Results Section */}
          <div className="bg-gray-50 rounded-md shadow-sm p-6 md:p-8 border border-gray-300">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Design Examples
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center"
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
                    className={`aspect-[4/5] bg-white rounded-lg relative cursor-pointer transition-all border-2 ${
                      selectedImage === index
                        ? "border-red-500 ring-2 ring-red-500"
                        : "border-gray-200 hover:border-red-400"
                    }`}
                    onClick={() => {
                      setSelectedImage(index);
                      setShowModal(true);
                    }}
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
                <div className="col-span-full">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      "heb.webp",
                      "facebook.webp",
                      "google.webp",
                      "slack.webp",
                    ].map((image, index) => (
                      <div
                        key={index}
                        className="aspect-[4/5] bg-white rounded-lg relative border-2 border-gray-200 hover:border-red-400"
                      >
                        <Image
                          src={`/${image}`}
                          alt={`${image
                            .split(".")[0]
                            .replace(/-/g, " ")} Socks`}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="p-3"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-500 mt-6 text-center">
                    Enter your design idea above to create your own custom socks
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
          {/*  */}
        </div>
      </main>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              Where should we send your design?
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-gray-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Business Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-gray-900"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="sockBuilderDesignNotes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Notes
                </label>
                <textarea
                  id="sockBuilderDesignNotes"
                  value={formData.sockBuilderDesignNotes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sockBuilderDesignNotes: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none resize-none text-gray-900"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-sm font-bold rounded-lg border hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
