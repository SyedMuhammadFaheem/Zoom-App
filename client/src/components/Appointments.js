import { React, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Appointments() {
  const [token, setToken] = useState("");
  const [link1, setLink1] = useState("");
  const location = useLocation();
  const handleCreateMeeting = async () => {
    const details = {
      agenda: "Test Meeting",
      topic: "Faheem Meeting",
      type: 2,
      duration: 2,
      start_time: "2024-03-09T09:505:00Z",
      settings: {
        host_video: true,
        join_before_host: true,
        participant_video: true,
        mute_upon_entry: "true",
        watermark: "true",
        audio: "voip",
        auto_recording: "cloud",
      },
    };
    const data = {
      details: details,
      token: token,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/create-meeting",
        data
      );

      console.log("Start URL:", response.data.start_url);
      setLink1(response.data.start_url)
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };
  const handleDeleteMeeting = () => {};

  useEffect(() => {
    const handleOAuth = async () => {
      const clientId = "2RtuogVRsODY91zlTytpQ";
      const redirectUri = "http://localhost:3000/appointments";

      const authorizationCode = location.search.substring(
        6,
        location.search.length
      );

      if (!authorizationCode) {
        const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
        window.location.href = zoomAuthUrl;
      } else {
        console.log(authorizationCode);
        window.history.replaceState(null, null, redirectUri);
        const data = {
          authorizationCode: authorizationCode,
          redirect_uri: redirectUri,
        };

        try {
          const response = await axios.post(
            "http://localhost:3001/exchange-code",
            data
          );

          console.log("Zoom Access Token:", response.data.access_token);
          setToken(response.data.access_token);
        } catch (error) {
          console.error("Error exchanging code for token:", error);
        }
      }
    };

    handleOAuth();
  }, []);

  return (
    <div>
      <table className="w-full max-w-2xl bg-white shadow-md rounded overflow-hidden my-10 mx-auto">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="py-2">Video URL</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-100 w-full">
            <td id="link1" className="py-4 px-6">
              Link 1 here:{link1 ? link1 : ""}
            </td>
            <td className="py-4 px-6 flex justify-end items-center space-x-4">
              <button
                className="bg-blue-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                onClick={handleCreateMeeting}
              >
                Create Meeting
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                onClick={handleDeleteMeeting}
              >
                Delete Meeting
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Appointments;
