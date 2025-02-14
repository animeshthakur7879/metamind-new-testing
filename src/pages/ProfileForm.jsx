import React, { useState, useEffect } from 'react';
import './ProfileForm.css'; // Custom CSS for background and stars

const ProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['step1', 'step2', 'step3', 'step4'];
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zip: ''
    },
    educationLevel: '',
    fieldOfStudy: '',
    institution: '',
    dreamJob: '',
    dreamCompany: '',
    shortTermGoals: '',
    longTermGoals: '',
    strengths: [],
    strengthsText: '',
    weaknesses: '',
    hobbies: '',
    interests: [],
    resume: null,
    profilePicture: null,
    bio: ''
  });
  

  // Fetch existing profile data on mount so that the form is pre-filled
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Failed to fetch profile data");
          }
          return res.json();
        })
        .then(data => {
          setFormData({
            fullName: data.fullName || '',
            dob: data.dob || '',
            gender: data.gender || '',
            phone: data.phone || '',
            email: data.email || '',
            address: {
              street: data.street || '',
              city: data.city || '',
              state: data.state || '',
              country: data.country || '',
              zip: data.zip || ''
            },
            educationLevel: data.educationLevel || '',
            fieldOfStudy: data.fieldOfStudy || '',
            institution: data.institution || '',
            dreamJob: data.dreamJob || '',
            dreamCompany: data.dreamCompany || '',
            shortTermGoals: data.shortTermGoals || '',
            longTermGoals: data.longTermGoals || '',
            strengths: data.strengths ? data.strengths.split(',') : [],
            strengthsText: data.strengthsText || '',
            weaknesses: data.weaknesses || '',
            hobbies: data.hobbies || '',
            interests: data.interests ? data.interests.split(',') : [],
            resume: null, // Files are not prefilled
            profilePicture: null, // Files are not prefilled
            bio: data.bio || ''
          });
        })
        .catch(err => console.error(err));
    }
  }, []);

  // Update progress bar based on the current step
  const updateProgressBar = () => {
    const progress = ((currentStep + 1) / steps.length) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  };

  // Show only the current form step
  const showStep = (step) => {
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach((el, index) => {
      el.classList.toggle('active', index === step);
    });
    updateProgressBar();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle changes in text, select, or file inputs
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name.includes('address')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value }
      });
    } else if (name === 'strengths' || name === 'interests') {
      const options = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData({ ...formData, [name]: options });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Ensure the correct step is visible on step change
  useEffect(() => {
    showStep(currentStep);
  }, [currentStep]);

  // Handle form submission using FormData to support file uploads
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append("fullName", formData.fullName);
    dataToSend.append("dob", formData.dob);
    dataToSend.append("gender", formData.gender);
    dataToSend.append("phone", formData.phone);
    dataToSend.append("email", formData.email);

    // Address fields
    dataToSend.append("street", formData.address.street);
    dataToSend.append("city", formData.address.city);
    dataToSend.append("state", formData.address.state);
    dataToSend.append("country", formData.address.country);
    dataToSend.append("zip", formData.address.zip);

    // Educational & Professional details
    dataToSend.append("educationLevel", formData.educationLevel);
    dataToSend.append("fieldOfStudy", formData.fieldOfStudy);
    dataToSend.append("institution", formData.institution);
    dataToSend.append("dreamJob", formData.dreamJob);
    dataToSend.append("dreamCompany", formData.dreamCompany);
    dataToSend.append("shortTermGoals", formData.shortTermGoals);
    dataToSend.append("longTermGoals", formData.longTermGoals);

    // Strengths, weaknesses, hobbies, interests
    dataToSend.append("strengths", formData.strengths.join(',')); // Stored as comma-separated
    dataToSend.append("strengthsText", formData.strengthsText);
    dataToSend.append("weaknesses", formData.weaknesses);
    dataToSend.append("hobbies", formData.hobbies);
    dataToSend.append("interests", formData.interests.join(','));

    // Append files if selected
    if (formData.resume) {
      dataToSend.append("resume", formData.resume);
    }
    if (formData.profilePicture) {
      dataToSend.append("profilePicture", formData.profilePicture);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
          // Do NOT set Content-Type manually when using FormData.
        },
        body: dataToSend
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Profile update failed");
      }
      
      const result = await response.json();
      alert(result.message || "Profile completed");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-light relative">
      <div className="meta-mind-text">Meta Mind</div>
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-gray-900 rounded-lg shadow-lg p-8 mt-5 form-container">
              <h3 className="text-center text-3xl font-bold text-white mb-4 shadow-md">Profile Form</h3>
              <form id="profileForm" onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" id="progressBar" style={{ width: '0%' }}></div>
                </div>

                {/* Step 1: Personal Information */}
                <div id="step1" className={`form-step ${currentStep === 0 ? 'active' : ''}`}>
                  <h5 className="text-white mb-4">Personal Information</h5>
                  <div className="mb-4">
                    <label htmlFor="fullName" className="block text-gray-400 mb-2">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="dob" className="block text-gray-400 mb-2">Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="gender" className="block text-gray-400 mb-2">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required>
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-400 mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required />
                  </div>
                  <h6 className="text-white mb-2">Address</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="street" className="block text-gray-400 mb-2">Street Address</label>
                      <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-gray-400 mb-2">City</label>
                      <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label htmlFor="state" className="block text-gray-400 mb-2">State/Province</label>
                      <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-gray-400 mb-2">Country</label>
                      <input type="text" name="address.country" value={formData.address.country} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required />
                    </div>
                    <div>
                      <label htmlFor="zip" className="block text-gray-400 mb-2">ZIP/Postal Code</label>
                      <input type="text" name="address.zip" value={formData.address.zip} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required />
                    </div>
                  </div>
                  <div className="mb-4 mt-4">
                    <label htmlFor="profilePicture" className="block text-gray-400 mb-2">Profile Picture</label>
                    <input type="file" name="profilePicture" onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" accept="image/*" required />
                  </div>
                  <div className="buttons-container">
                    <button type="button" className="small-button bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded hover:from-blue-600 hover:to-purple-600" onClick={handleNext}>Next</button>
                  </div>
                </div>

                {/* Step 2: Educational Background */}
                <div id="step2" className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                  <h5 className="text-white mb-4">Educational Background</h5>
                  <div className="mb-4">
                    <label htmlFor="educationLevel" className="block text-gray-400 mb-2">Current Education Level</label>
                    <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required>
                      <option value="" disabled>Select Education Level</option>
                      <option value="High School">High School</option>
                      <option value="Bachelor's">Bachelor's</option>
                      <option value="Master's">Master's</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="fieldOfStudy" className="block text-gray-400 mb-2">Field of Study</label>
                    <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="institution" className="block text-gray-400 mb-2">Current Institution Name</label>
                    <input type="text" name="institution" value={formData.institution} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="resume" className="block text-gray-400 mb-2">Upload Resume</label>
                    <input type="file" name="resume" onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" accept=".pdf,.doc,.docx,.txt" required />
                  </div>
                  <div className="buttons-container">
                    <button type="button" className="small-button bg-gray-700 text-white font-bold rounded hover:bg-gray-600" onClick={handleBack}>Back</button>
                    <button type="button" className="small-button bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded hover:from-blue-600 hover:to-purple-600" onClick={handleNext}>Next</button>
                  </div>
                </div>

                {/* Step 3: Professional Aspirations */}
                <div id="step3" className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                  <h5 className="text-white mb-4">Professional Aspirations</h5>
                  <div className="mb-4">
                    <label htmlFor="dreamJob" className="block text-gray-400 mb-2">Dream Job Role</label>
                    <input type="text" name="dreamJob" value={formData.dreamJob} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="dreamCompany" className="block text-gray-400 mb-2">Dream Company</label>
                    <input type="text" name="dreamCompany" value={formData.dreamCompany} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="shortTermGoals" className="block text-gray-400 mb-2">Short-Term Goals</label>
                    <textarea name="shortTermGoals" value={formData.shortTermGoals} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" rows="3" required></textarea>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="longTermGoals" className="block text-gray-400 mb-2">Long-Term Goals</label>
                    <textarea name="longTermGoals" value={formData.longTermGoals} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" rows="3" required></textarea>
                  </div>
                  <div className="buttons-container">
                    <button type="button" className="small-button bg-gray-700 text-white font-bold rounded hover:bg-gray-600" onClick={handleBack}>Back</button>
                    {/* Use Next button here to proceed to the final step */}
                    <button type="button" className="small-button bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded hover:from-blue-600 hover:to-purple-600" onClick={handleNext}>Next</button>
                  </div>
                </div>

                {/* Step 4: Strengths and Weaknesses (Final Step with Submit) */}
                <div id="step4" className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
                  <h5 className="text-white mb-4">Strengths and Weaknesses</h5>
                  <div className="mb-4">
                    <label htmlFor="strengths" className="block text-gray-400 mb-2">Select Your Strengths</label>
                    <select name="strengths" multiple onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500">
                      <option value="Leadership">Leadership</option>
                      <option value="Creativity">Creativity</option>
                      <option value="Problem Solving">Problem Solving</option>
                      <option value="Adaptability">Adaptability</option>
                      <option value="Communication">Communication</option>
                      <option value="Technical Skills">Technical Skills</option>
                      <option value="Teamwork">Teamwork</option>
                    </select>
                    <small className="text-gray-400">Hold CTRL (Windows) or CMD (Mac) to select multiple options.</small>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="strengthsText" className="block text-gray-400 mb-2">Describe Your Strengths</label>
                    <textarea name="strengthsText" value={formData.strengthsText} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" rows="3"></textarea>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="weaknesses" className="block text-gray-400 mb-2">Describe Your Weaknesses</label>
                    <textarea name="weaknesses" value={formData.weaknesses} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" rows="3"></textarea>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="hobbies" className="block text-gray-400 mb-2">Hobbies</label>
                    <textarea name="hobbies" value={formData.hobbies} onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" rows="4" placeholder="Write your hobbies here..."></textarea>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="interests" className="block text-gray-400 mb-2">Interests</label>
                    <select name="interests" multiple onChange={handleChange} className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500">
                      <option value="technology">Technology</option>
                      <option value="sports">Sports</option>
                      <option value="music">Music</option>
                      <option value="reading">Reading</option>
                      <option value="travel">Travel</option>
                      <option value="gaming">Gaming</option>
                      <option value="art">Art</option>
                      <option value="fitness">Fitness</option>
                    </select>
                  </div>
                  <div className="buttons-container">
                    <button type="button" className="small-button bg-gray-700 text-white font-bold rounded hover:bg-gray-600" onClick={handleBack}>Back</button>
                    {/* Final Submit Button */}
                    <button type="submit" className="small-button bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded hover:from-blue-600 hover:to-purple-600">Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
