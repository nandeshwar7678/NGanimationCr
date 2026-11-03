
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function LessonPlayer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [error, setError] = useState("");
  const [playbackRate, setPlaybackRate] = useState("1");

  // Load lessons
  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/courses/lessons.php?slug=${encodeURIComponent(slug)}`,
          {
            credentials: "include",
            cache: "no-store"
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load lessons.");
        }

        setLessons(data.lessons || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [slug]);

  // Verify lesson access before loading video
  const openLesson = async (lesson) => {
    try {
      setVideoLoading(true);
      setError("");
      setSelectedLesson(null);
      setPlaybackRate("1");

      const response = await fetch(
        `/api/courses/video.php?lesson_id=${lesson.id}`,
        {
          credentials: "include",
          cache: "no-store"
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to access this lesson.");
      }

      setSelectedLesson(data.lesson);

    } catch (err) {
      setError(err.message);
    } finally {
      setVideoLoading(false);
    }
  };

  // Change video playback speed
  const changeSpeed = (value) => {
    setPlaybackRate(value);

    if (videoRef.current) {
      videoRef.current.playbackRate = Number(value);
    }
  };

  // Fullscreen
  const handleFullscreen = async () => {
    if (!videoRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await videoRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b14] text-white flex items-center justify-center">
        Loading lessons...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b14] text-white px-4 py-10">

      <div className="max-w-7xl mx-auto">

        <button
          onClick={() => navigate("/my-learning")}
          className="mb-6 text-purple-400 hover:text-purple-300"
        >
          ← Back to My Learning
        </button>

        <h1 className="text-3xl font-bold mb-2">
          Course Lessons
        </h1>

        <p className="text-gray-400 mb-8">
          Select a lesson and start learning.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Lessons Sidebar */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">

            <h2 className="text-xl font-semibold mb-5">
              Course Content ({lessons.length})
            </h2>

            <div className="space-y-3">

              {lessons.map((lesson, index) => (

                <button
                  key={lesson.id}
                  onClick={() => openLesson(lesson)}
                  disabled={videoLoading}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    selectedLesson?.id === lesson.id
                      ? "bg-purple-600/20 border-purple-500"
                      : "bg-white/5 border-white/10 hover:border-purple-500/50"
                  } disabled:opacity-50`}
                >

                  <div className="flex items-center gap-3">

                    <span className="text-purple-400 font-bold">
                      {index + 1}.
                    </span>

                    <span className="text-sm font-medium">
                      {lesson.title}
                    </span>

                  </div>

                </button>

              ))}

            </div>

          </div>

          {/* Video Player Area */}
          <div className="lg:col-span-2 bg-[#111827] border border-white/10 rounded-2xl p-5 sm:p-6">

            {videoLoading ? (

              <div className="py-24 text-center text-gray-400">
                Verifying lesson access...
              </div>

            ) : selectedLesson ? (

              <>

                <h2 className="text-2xl font-bold mb-3">
                  {selectedLesson.title}
                </h2>

                <p className="text-gray-400 mb-6">
                  {selectedLesson.description}
                </p>

                {/* Actual Video */}
                <div className="bg-black rounded-xl overflow-hidden border border-white/10">

                  <video
                    key={selectedLesson.id}
                    ref={videoRef}
                    controls
                    playsInline
                    preload="metadata"
                    controlsList="nodownload"
                    className="w-full aspect-video"
                    src={`/api/courses/video-stream.php?lesson_id=${encodeURIComponent(selectedLesson.id)}`}
                    onError={() => {
                      setError(
                        "Video play nahi ho pa rahi. Streaming API aur server response check karein."
                      );
                    }}
                  >
                    Your browser does not support HTML5 video.
                  </video>

                </div>

                {/* Player Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-5">

                  <div className="flex items-center gap-3">

                    <label
                      htmlFor="playback-speed"
                      className="text-gray-400 text-sm"
                    >
                      Playback Speed
                    </label>

                    <select
                      id="playback-speed"
                      value={playbackRate}
                      onChange={(e) => changeSpeed(e.target.value)}
                      className="bg-[#080b14] border border-white/20 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="1.75">1.75x</option>
                      <option value="2">2x</option>
                    </select>

                  </div>

                  <button
                    onClick={handleFullscreen}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Fullscreen
                  </button>

                </div>

                <p className="text-gray-500 text-xs mt-5">
                  Your course access is verified. Enjoy learning!
                </p>

              </>

            ) : (

              <div className="py-24 text-center">

                <div className="text-5xl mb-4">
                  🎬
                </div>

                <h2 className="text-xl font-semibold mb-2">
                  Select a Lesson
                </h2>

                <p className="text-gray-400">
                  Choose a lesson from the left side to start watching.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}
