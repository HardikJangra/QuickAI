import React, { useState } from "react";
import { Edit, Sparkles } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";

// 🔹 Axios base URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" }
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
  
      const prompt = `Write a detailed article about ${input} in ${selectedLength.length} words`;
  
      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
  
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="h-full overflow-y-scroll p-6 flex flex-wrap gap-4 text-slate-700">
      {/* Left */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-blue-600" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="w-full p-2 mt-2 border rounded"
          placeholder="The future of artificial intelligence..."
          required
        />

        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {articleLength.map((item, i) => (
            <span
              key={i}
              onClick={() => setSelectedLength(item)}
              className={`px-4 py-1 text-xs border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? "bg-blue-100 border-blue-400 text-blue-700"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full mt-6 py-2 bg-blue-600 text-white rounded flex justify-center items-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Edit className="w-4" />
          )}
          Generate Article
        </button>
      </form>

      {/* Right */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg border min-h-96">
        <h1 className="text-xl font-semibold mb-2">Generated Article</h1>

        {!content ? (
          <p className="text-sm text-gray-400 text-center mt-20">
            Enter a topic and generate an article
          </p>
        ) : (
          <div className="text-sm overflow-y-auto max-h-[500px]">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
