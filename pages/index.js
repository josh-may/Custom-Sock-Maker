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

  const [successMessage, setSuccessMessage] = React.useState("");
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const currentUrl = params.get("parent_url");

      setAttributionData({
        parentUrl: currentUrl || window.location.href,
        utmSource: params.get("utm_source") || "",
        utmMedium: params.get("utm_medium") || "",
        utmCampaign: params.get("utm_campaign") || "",
        utmTerm: params.get("utm_term") || "",
        utmContent: params.get("utm_content") || "",
      });
    } catch (error) {
      console.error("Error parsing URL parameters:", error);
      setAttributionData({
        parentUrl: window.location.href,
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        utmTerm: "",
        utmContent: "",
      });
    }
  }, []);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const generateSockImage = async () => {
    setIsLoading(true);
    setSelectedImage(null);
    setSockImages([]);
    try {
      const prompts = [
        `User prompt:
${prompt}

Backend Prompt: 
Using the user prompt above, make a simple sketch, illustration style, 3/4 angle sock mock-up. background white.`,

        `User prompt:
${prompt}

Backend Prompt: 
Using the user prompt above, make a simple sketched, illustration style, 3/4 angle, white background, sock mock-up`,

        `User prompt:
${prompt}

Backend Prompt: 
Using the user prompt above, make a simple sock mock-up sketch from a 3/4 angle, white background.`,
        `User prompt:
${prompt}

Backend Prompt: 
Using the user prompt above, make a simple sketched sock mock-up from a 3/4 angle. white background. Drawn in a casual illustration style.`,
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

  const handleSockClick = (index) => {
    setSelectedImage(index);
    if (formData.firstName && formData.lastName && formData.email) {
      handleSubmit();
    } else {
      setShowModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      selectedImage === null
    ) {
      setSuccessMessage(
        "Please fill in all required fields and select a design."
      );
      return;
    }

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
      setSuccessMessage(
        "Design submitted successfully! We'll be in touch soon."
      );
      setTimeout(() => {
        setShowModal(false);
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error details:", error);
      setSuccessMessage("Failed to submit design. Please try again.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gray-50 ">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col space-y-5 mt-10">
            <div className="max-w-4xl">
              <h1 className="text-2xl sm:text-3xl font-proxima-nova-bold text-black mb-4 sm:mb-6">
                <strong>Custom Sock Builder</strong>
              </h1>
              <p className="text-base sm:text-lg font-proxima-nova text-gray-700">
                Design your perfect custom socks in seconds. Simply describe
                your idea, and we&apos;ll help you bring it to life.
              </p>
            </div>
            <div className="space-y-4">
              <div className="pb-5">
                <div className="space-y">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isLoading && prompt.trim()) {
                          generateSockImage();
                        }
                      }}
                      placeholder=" Create a yellow sock design..."
                      className="flex-1 border-2 border-gray-200 rounded-lg p-3 sm:p-4 text-base sm:text-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                    <button
                      onClick={generateSockImage}
                      disabled={isLoading || !prompt.trim()}
                      className={`whitespace-nowrap text-white font-bold py-3 px-4 sm:py-2 sm:px-6 rounded-lg transition-all w-full sm:w-auto ${
                        isLoading
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      } font-bold text-base sm:text-lg`}
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
                          <span>Generating...</span>
                        </span>
                      ) : (
                        "Generate Design"
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm p-1 mt-2 text-gray-500 mt-2 italic">
                    Example: Make an orange crew sock for our company
                    &ldquo;Sunrise Corp&rdquo;. Add a rising sun on the body of
                    the sock.
                  </p>
                </div>
              </div>

              <div className="border-b border-gray-200"></div>

              <div className="pt-5">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {sockImages.length > 0 ? "Your Results" : "Design Examples"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {isLoading ? (
                    [...Array(isMobile ? 1 : 4)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square sm:aspect-[4/5] bg-white rounded-lg border border-gray-200 flex items-center justify-center"
                      >
                        <div className="animate-pulse text-gray-400 text-xs sm:text-sm">
                          Generating...
                        </div>
                      </div>
                    ))
                  ) : sockImages.length > 0 ? (
                    sockImages
                      .slice(0, isMobile ? 1 : 4)
                      .map((image, index) => (
                        <div
                          key={index}
                          className={`aspect-square sm:aspect-[4/5] bg-white rounded-lg relative cursor-pointer transition-all border ${
                            selectedImage === index
                              ? "border-red-500 ring-2 ring-red-500"
                              : "border-gray-200 hover:border-red-400"
                          }`}
                          onClick={() => handleSockClick(index)}
                        >
                          <Image
                            src={image}
                            alt={`Sock design ${index + 1}`}
                            fill
                            priority
                            className="p-2 sm:p-3"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      ))
                  ) : (
                    <div className="col-span-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        {[
                          "example1.webp",
                          "example2.webp",
                          "example3.webp",
                          "example4.webp",
                        ]
                          .slice(0, isMobile ? 1 : 4)
                          .map((image, index) => (
                            <div
                              key={index}
                              className="aspect-square sm:aspect-[4/5] bg-white rounded-lg relative border border-gray-200"
                            >
                              <Image
                                src={`/${image}`}
                                alt={`${image
                                  .split(".")[0]
                                  .replace(/-/g, " ")} Socks`}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                                className="p-2 sm:p-3"
                                style={{ objectFit: "contain" }}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                {selectedImage !== null && (
                  <div className="text-center text-gray-600 font-medium mt-4">
                    Design {selectedImage + 1} selected
                  </div>
                )}
                {sockImages.length > 0 && (
                  <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 italic text-center px-4">
                    Disclaimer: This sock builder is still in beta. We&apos;ll
                    do our best to replicate your design, but the final product
                    may vary slightly from the generated preview.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </section>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.6)_8%,rgba(255,255,255,0)_30%)]"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="bg-white rounded-xl p-4 sm:p-8 w-full max-w-md shadow-lg relative z-10 mx-4 sm:mx-0">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">
              Where should we send your design?
            </h3>
            {successMessage && (
              <div className="mb-4 p-3 sm:p-4 bg-green-50 text-green-700 rounded-lg text-sm sm:text-base">
                {successMessage}
              </div>
            )}
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-gray-900 text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-gray-900 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Business Email*
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-gray-900 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none resize-none text-gray-900 text-sm sm:text-base"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 sm:space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-bold rounded-lg border hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
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
