import React, { useState } from "react";

const accentColor = "#4a90e2";

// Reusable button component with hover/active styling
function Button({ children, onClick, disabled }) {
  const [isHovered, setHovered] = useState(false);
  const [isActive, setActive] = useState(false);

  const baseStyle = {
    padding: "10px 20px",
    borderRadius: "16px",
    backgroundColor: accentColor,
    color: "#fff",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color 0.3s ease, box-shadow 0.2s ease",
    outline: "none",
    userSelect: "none",
    opacity: disabled ? 0.6 : 1,
    display: "inline-block",
    fontWeight: "600",
    fontSize: "16px",
  };

  const hoverStyle = {
    backgroundColor: disabled ? accentColor : "#d3d3d3",
    color: disabled ? "#fff" : "#000",
  };

  const activeStyle = {
    backgroundColor: disabled ? accentColor : "#a0a0a0",
    boxShadow: disabled ? "none" : "inset 0 2px 4px rgba(0,0,0,0.3)",
    color: disabled ? "#fff" : "#000",
  };

  const style = {
    ...baseStyle,
    ...(isHovered ? hoverStyle : {}),
    ...(isActive ? activeStyle : {}),
  };

  return (
    <button
      style={style}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => {
        setHovered(false);
        setActive(false);
      }}
      type="button"
    >
      {children}
    </button>
  );
}

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedPlaceType, setSelectedPlaceType] = useState("");

  const totalSteps = 2;
  const progressPercent = (step / totalSteps) * 100;

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#f7f7f7",
        minHeight: "100vh",
        padding: "32px 16px",
        fontFamily:
          "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.12)",
          color: "#222",
        }}
      >
        {/* Progress Bar */}
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          style={{
            height: "6px",
            backgroundColor: "#e0e0e0",
            borderRadius: "3px",
            overflow: "hidden",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              backgroundColor: accentColor,
              borderRadius: "3px",
              transition: "width 0.3s ease",
            }}
          ></div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "16px",
              padding: "24px",
              maxHeight: "360px",
              overflowY: "auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            {/* Property Type */}
            <label
              style={{
                fontWeight: "900",
                fontSize: "18px",
                marginBottom: "16px",
                display: "block",
              }}
            >
              Property Type
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              {["Apartment", "House", "Villa", "Guesthouse", "Hotel"].map(
                (type) => (
                  <div
                    key={type}
                    onClick={() => setSelectedPropertyType(type)}
                    style={{
                      padding: "10px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      textAlign: "center",
                      fontWeight: "600",
                      backgroundColor:
                        selectedPropertyType === type ? "#000" : "#fff",
                      color:
                        selectedPropertyType === type ? "#fff" : "#000",
                      border: "1px solid #000",
                      transition: "all 0.2s ease",
                      userSelect: "none",
                    }}
                  >
                    {type}
                  </div>
                )
              )}
            </div>

            {/* Type of Place */}
            <label
              style={{
                fontWeight: "900",
                fontSize: "18px",
                marginBottom: "16px",
                display: "block",
              }}
            >
              Type of Place
            </label>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              {["Entire Place", "Private Room", "Shared Room"].map(
                (place) => (
                  <div
                    key={place}
                    onClick={() => setSelectedPlaceType(place)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "600",
                      backgroundColor:
                        selectedPlaceType === place ? "#000" : "#fff",
                      color: selectedPlaceType === place ? "#fff" : "#000",
                      border: "1px solid #000",
                      transition: "all 0.2s ease",
                      userSelect: "none",
                    }}
                  >
                    {place}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <label
              style={{
                display: "block",
                fontWeight: "900",
                marginBottom: "20px",
                fontSize: "18px",
                color: "#484848",
              }}
            >
              Listing Categories
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              {[
                "Trending",
                "Beach",
                "Iconic Cities",
                "Mountains",
                "Rooms",
                "Amazing Pools",
                "Camping",
                "Lake Front",
                "Castles",
                "Farms",
                "Tiny House",
                "Cable Car",
                "Hotels",
                "Worship",
                "Domes",
                "Boats"
              ].map((tag) => {
                const isSelected = selectedTags.includes(tag);

                return (
                  <div
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    onMouseEnter={(e) =>
                      !isSelected &&
                      (e.currentTarget.style.backgroundColor = "#e6f0ff")
                    }
                    onMouseLeave={(e) =>
                      !isSelected &&
                      (e.currentTarget.style.backgroundColor = "#fff")
                    }
                    style={{
                      padding: "7px",
                      border: "1px solid #000",
                      borderRadius: "14px",
                      textAlign: "center",
                      cursor: "pointer",
                      fontWeight: "600",
                      color: isSelected ? "#fff" : "#000",
                      backgroundColor: isSelected ? "#000" : "#fff",
                      transition: "all 0.2s ease",
                      userSelect: "none",
                    }}
                  >
                    {tag}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "40px",
          }}
        >
          <Button
            onClick={() => setStep((s) => Math.max(s - 1, 1))}
            disabled={step === 1}
          >
            Back
          </Button>

          <Button
            onClick={() => {
              if (step < totalSteps) {
                setStep((s) => s + 1);
              } else {
                alert("Form submitted!");
              }
            }}
          >
            {step < totalSteps ? "Next" : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
