import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const SkillInput = ({ skills, setSkills }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/skills?search=${inputValue}`);
        // Filter out suggestions that are already selected
        const filteredSuggestions = res.data.filter(
          (s) =>
            !skills.find((skill) => skill.toLowerCase() === s.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      } catch (err) {
        console.error("Failed to fetch skills", err);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutRef.current);
  }, [inputValue, skills]);

  const addSkill = async (skill) => {
    const trimmedSkill = skill.trim();
    if (
      trimmedSkill &&
      !skills.find((s) => s.toLowerCase() === trimmedSkill.toLowerCase())
    ) {
      setSkills([...skills, trimmedSkill]);

      // Also add the skill to the DB if it's new
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const config = { headers: { "x-auth-token": token } };
          await axios.post("/api/skills", { name: trimmedSkill }, config);
        }
      } catch (err) {
        // Might fail if skill already exists (race condition) or other errors, but we can ignore for the frontend.
        console.log("Could not save new skill, it might already exist.");
      }
    }
    setInputValue("");
    setSuggestions([]);
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  return (
    <div className="skill-input-container">
      <div className="skills-display">
        {skills.map((skill, index) => (
          <div key={index} className="skill-chip">
            {skill}
            <button type="button" onClick={() => removeSkill(skill)}>
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="input-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => addSkill(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SkillInput;
