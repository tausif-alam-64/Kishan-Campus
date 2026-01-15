import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TeacherUploads = () => {
  const navigate = useNavigate();
  const [showModel, setShowModel] = useState(false);

  // Mock uploads
  const uploads = [
    {
      id: 1,
      title: "Math Chapter 5 Notes",
      type: "PDF",
      date: "08 Oct 2026",
    },
    {
      id: 2,
      title: "Science Assignment",
      type: "DOC",
      date: "04 Oct 2026",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-24 bg-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-(--secondary) ">Uploads</h1>
          <p className="mt-1 text-(--ternary)">
            Upload study materials for students.
          </p>
        </div>
        <button
          onClick={() => setShowModel(true)}
          className="bg-(--secondary) text-white px-5 py-2 rounded-lg font-medium hover:bg-(--primary) transition"
        >
          + Upload File
        </button>
      </div>
      <div className="space-y-4">
        {uploads.map((file) => (
          <div
            key={file.id}
            className="bg-white rounded-xl p-5 flex justify-between items-center hover:shadow-lg transition"
          >
            <div>
              <h3 className="text-lg font-semibold text-(--secondary)">
                {file.title}
              </h3>
              <p className="text-sm text-(--ternary)">
                {file.type} • {file.date}
              </p>
            </div>
            <button className="text-(--secondary) font-medium hover:bg-gray-200 rounded-lg px-2 py-1 hover:shadow-sm">
              view
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/teacher")}
        className="mt-10 text-(--secondary) font-medium hover:bg-gray-200 rounded-lg px-2 py-1 hover:shadow-sm"
      >
        ← Back to Dashboard
      </button>

      {showModel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
            <h2 className="text-xl font-bold text-(--primary)">
              Upload Study Material
            </h2>
            <form className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="file Title"
                className=" w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="file"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModel(false)}
                  className="px-4 py-2 border rounded-lg text-(--ternary) hover:bg-gray-100"
                >
                  Calcel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-(--secondary) text-white rounded-lg hover:bg-(--primary)"
                >
                  Public
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherUploads;
