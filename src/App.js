import React, { useState, useEffect } from 'react';
import { Coffee, MapPin, AlertCircle, TrendingUp, Beer, Clock } from 'lucide-react';

export default function AlbertaCaffeineApp() {
  const [location, setLocation] = useState(null);
  const [isAlberta, setIsAlberta] = useState(null);
  const [showAcceptance, setShowAcceptance] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [useImperial, setUseImperial] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    bloodPressure: '',
    bpm: '',
    gender: 'male',
    activityLevel: 'moderate',
    caffeineTolérance: 'moderate',
    unknownBP: false,
    unknownBPM: false
  });
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLocation();
  }, []);

  const checkLocation = async () => {
    // Try multiple APIs with better CORS support
    const apis = [
      'https://ipapi.co/json/',
      'https://api.ipify.org?format=json', // Just to test connectivity
      'https://geolocation-db.com/json/',
    ];
    
    // Try ipapi.co first (HTTPS, good CORS support)
    try {
      console.log('Attempting location detection via ipapi.co...');
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('ipapi.co response:', data);
      
      if (data && data.city && !data.error && data.country_code) {
        const locationData = {
          city: data.city,
          region: data.region || 'Unknown',
          country: data.country_code,
          country_name: data.country_name || data.country,
          ip: data.ip
        };
        
        console.log('✓ Location successfully detected:', locationData);
        setLocation(locationData);
        
        const albertaCheck = (
          (data.region === 'Alberta' || data.region_code === 'AB') && 
          data.country_code === 'CA'
        );
        
        setIsAlberta(albertaCheck);
        if (!albertaCheck) setShowAcceptance(true);
        return;
      }
    } catch (error) {
      console.error('ipapi.co failed:', error.message);
    }
    
    // Try geolocation-db.com
    try {
      console.log('Trying geolocation-db.com...');
      const response = await fetch('https://geolocation-db.com/json/');
      const data = await response.json();
      console.log('geolocation-db response:', data);
      
      if (data && data.city) {
        const locationData = {
          city: data.city,
          region: data.state || 'Unknown',
          country: data.country_code,
          country_name: data.country_name,
          ip: data.IPv4
        };
        
        console.log('✓ Location detected via geolocation-db:', locationData);
        setLocation(locationData);
        
        const albertaCheck = data.state === 'Alberta' && data.country_code === 'CA';
        setIsAlberta(albertaCheck);
        if (!albertaCheck) setShowAcceptance(true);
        return;
      }
    } catch (error) {
      console.error('geolocation-db failed:', error.message);
    }
    
    // Default fallback - assume user's provided location
    console.warn('⚠️ Location detection failed. Using provided location info.');
    const defaultLocation = {
      city: 'Santa Clara',
      region: 'California',
      country: 'US',
      country_name: 'United States',
      ip: 'Detection failed'
    };
    
    setLocation(defaultLocation);
    setIsAlberta(false);
    setShowAcceptance(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const convertToMetric = (weight, height) => {
    if (useImperial) {
      return {
        weightKg: weight * 0.453592,
        heightCm: height * 2.54
      };
    }
    return { weightKg: parseFloat(weight), heightCm: parseFloat(height) };
  };

  const estimateBloodPressure = (age, weight, height, gender) => {
    const bmi = weight / ((height / 100) ** 2);
    let systolic = 110 + (age * 0.3);
    let diastolic = 70 + (age * 0.15);
    
    if (bmi > 25) systolic += 5 + ((bmi - 25) * 0.8);
    if (bmi > 25) diastolic += 3 + ((bmi - 25) * 0.5);
    if (gender === 'male') systolic += 2;
    
    return `${Math.round(systolic)}/${Math.round(diastolic)}`;
  };

  const estimateBPM = (age, activityLevel, gender) => {
    let baseBPM = 70;
    baseBPM -= (age > 30 ? (age - 30) * 0.1 : 0);
    
    if (activityLevel === 'sedentary') baseBPM += 5;
    if (activityLevel === 'active') baseBPM -= 5;
    if (activityLevel === 'very_active') baseBPM -= 10;
    if (gender === 'female') baseBPM += 2;
    
    return Math.round(baseBPM);
  };

  const calculateCaffeineLimit = async () => {
    setLoading(true);
    
    const { weightKg, heightCm } = convertToMetric(
      parseFloat(formData.weight),
      parseFloat(formData.height)
    );
    
    const age = parseInt(formData.age);
    
    let bp = formData.bloodPressure;
    if (formData.unknownBP) {
      bp = estimateBloodPressure(age, weightKg, heightCm, formData.gender);
    }
    
    let bpm = formData.bpm ? parseInt(formData.bpm) : null;
    if (formData.unknownBPM) {
      bpm = estimateBPM(age, formData.activityLevel, formData.gender);
    } else {
      bpm = parseInt(formData.bpm);
    }
    
    // Base caffeine calculation (mg per day)
    let maxCaffeine = Math.min(400, weightKg * 6);
    
    // Adjust for blood pressure
    const [systolic] = bp.split('/').map(Number);
    if (systolic > 130) maxCaffeine *= 0.7;
    if (systolic > 140) maxCaffeine *= 0.5;
    
    // Adjust for heart rate
    if (bpm > 80) maxCaffeine *= 0.8;
    if (bpm > 90) maxCaffeine *= 0.6;
    
    // Adjust for age
    if (age > 50) maxCaffeine *= 0.85;
    if (age < 25) maxCaffeine *= 0.9;
    
    // Adjust for tolerance
    if (formData.caffeineTolérance === 'low') maxCaffeine *= 0.7;
    if (formData.caffeineTolérance === 'high') maxCaffeine *= 1.2;
    
    maxCaffeine = Math.round(maxCaffeine);
    
    // Calculate drink equivalents
    const coffeeCups = Math.floor(maxCaffeine / 95);
    const energyDrinks = Math.floor(maxCaffeine / 180);
    const caffeinePills = Math.floor(maxCaffeine / 200);
    
    // AI-powered schedule generation
    const schedule = await generateSchedule(maxCaffeine, formData.activityLevel);
    
    // Beer calculation (just for fun)
    const beerLimit = calculateBeerLimit(weightKg, formData.gender, age);
    
    setResults({
      maxCaffeine,
      coffeeCups,
      energyDrinks,
      caffeinePills,
      schedule,
      beerLimit,
      estimatedBP: formData.unknownBP ? bp : null,
      estimatedBPM: formData.unknownBPM ? bpm : null
    });
    
    setLoading(false);
  };

  const generateSchedule = async (totalCaffeine, activityLevel) => {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { 
              role: "user", 
              content: `Create an optimal caffeine intake schedule for someone who can consume ${totalCaffeine}mg of caffeine per day with ${activityLevel} activity level. Respond ONLY with a JSON array of objects with 'time', 'amount' (as a number), and 'reason' fields. Make sure amount values are numbers, not strings. No preamble, no backticks, just the JSON array.`
            }
          ],
        })
      });

      const data = await response.json();
      const text = data.content[0].text.trim();
      const schedule = JSON.parse(text);
      // Ensure amounts are numbers
      return schedule.map(item => ({
        ...item,
        amount: Number(item.amount)
      }));
    } catch (error) {
      console.error('Schedule generation error:', error);
      return [
        { time: "7:00 AM", amount: Math.round(totalCaffeine * 0.4), reason: "Morning boost" },
        { time: "11:00 AM", amount: Math.round(totalCaffeine * 0.3), reason: "Mid-morning focus" },
        { time: "2:00 PM", amount: Math.round(totalCaffeine * 0.3), reason: "Post-lunch energy" }
      ];
    }
  };

  const calculateBeerLimit = (weightKg, gender, age) => {
    // Using Widmark formula for BAC
    const waterContent = gender === 'male' ? 0.68 : 0.55;
    const beerAlcohol = 14; // grams per standard beer
    
    // Productivity starts dropping around 0.05-0.06 BAC (noticeable but not severe)
    const productivityBAC = 0.055;
    
    // BAC = (alcohol in grams / (body weight in grams × water content)) × 100
    const beersToProductivityDrop = (productivityBAC * weightKg * 1000 * waterContent) / (beerAlcohol * 100);
    
    // Round down and ensure at least 2
    const productivityLimit = Math.max(2, Math.floor(beersToProductivityDrop));
    
    // Cap at reasonable maximum (5 beers)
    return Math.min(5, productivityLimit);
  };

  if (showAcceptance && !accepted && !isAlberta) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Howdy, Stranger! 🤠
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            This productivity optimizer is exclusively designed for Alberta, Canada - where the air is fresh, the Rockies are majestic, and productivity flows like oil! 
          </p>
          <p className="text-md text-gray-500 mb-8">
            {location && location.city !== 'Unknown' ? (
              <>Detected location: <strong>{location.city}, {location.region}, {location.country_name}</strong></>
            ) : (
              <>We couldn't detect your exact location, but you're not in Alberta, Canada</>
            )}
          </p>
          
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800 font-semibold mb-3">
              Ready to experience peak productivity?
            </p>
            <label className="flex items-start text-left cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 mr-3 w-5 h-5"
                onChange={(e) => {
                  if (e.target.checked) {
                    setTimeout(() => setAccepted(true), 500);
                  }
                }}
              />
              <span className="text-sm text-gray-700">
                I acknowledge that moving to Alberta would be a <strong>fantastic idea</strong> and would like to test the app anyway!
              </span>
            </label>
          </div>
          
          <p className="text-xs text-gray-400">
            (Just for fun - but seriously, Alberta is awesome! 🏔️)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Alberta Productivity Caffeine Optimizer ☕
              </h1>
              <p className="text-gray-600">Optimize your caffeine intake for peak performance</p>
            </div>
            <Coffee className="w-12 h-12 text-amber-600" />
          </div>
          {location && location.city !== 'Unknown' && location.city !== 'Unable to detect' && (
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              {location.city}, {location.region}, {location.country_name}
              {location.ip && location.ip !== 'Unknown' && (
                <span className="ml-2 text-xs text-gray-400">({location.ip})</span>
              )}
            </div>
          )}
          {location && (location.city === 'Unknown' || location.city === 'Unable to detect') && (
            <div className="mt-4 flex items-center text-sm text-yellow-600">
              <MapPin className="w-4 h-4 mr-2" />
              Location detection unavailable - check browser console for details
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Information</h2>
          
          {/* Unit Toggle */}
          <div className="mb-6 flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Measurement System:</label>
            <button
              onClick={() => setUseImperial(!useImperial)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                useImperial
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {useImperial ? 'Imperial (lb, in)' : 'Metric (kg, cm)'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your age"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight ({useImperial ? 'lb' : 'kg'})
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={useImperial ? "e.g., 165" : "e.g., 75"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height ({useImperial ? 'inches' : 'cm'})
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={useImperial ? "e.g., 70" : "e.g., 178"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Pressure (e.g., 120/80)
              </label>
              <input
                type="text"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleInputChange}
                disabled={formData.unknownBP}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="120/80"
              />
              <label className="flex items-center mt-2 text-sm">
                <input
                  type="checkbox"
                  name="unknownBP"
                  checked={formData.unknownBP}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                I don't know my blood pressure
              </label>
              {formData.unknownBP && (
                <p className="text-xs text-amber-600 mt-1 flex items-start">
                  <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  Will estimate based on age and body composition. Please validate with your doctor for accurate results.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resting Heart Rate (BPM)
              </label>
              <input
                type="number"
                name="bpm"
                value={formData.bpm}
                onChange={handleInputChange}
                disabled={formData.unknownBPM}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="e.g., 70"
              />
              <label className="flex items-center mt-2 text-sm">
                <input
                  type="checkbox"
                  name="unknownBPM"
                  checked={formData.unknownBPM}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                I don't know my BPM
              </label>
              {formData.unknownBPM && (
                <p className="text-xs text-amber-600 mt-1 flex items-start">
                  <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  Will estimate based on age and activity level. Please validate with your doctor for accurate results.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sedentary">Sedentary</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caffeine Tolerance</label>
              <select
                name="caffeineTolérance"
                value={formData.caffeineTolérance}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low (Rarely drink caffeine)</option>
                <option value="moderate">Moderate (1-2 cups/day)</option>
                <option value="high">High (3+ cups/day)</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculateCaffeineLimit}
            disabled={loading || !formData.age || !formData.weight || !formData.height}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>Calculating...</>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                Optimize My Caffeine Intake
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Estimates Warning */}
            {(results.estimatedBP || results.estimatedBPM) && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-1">Estimated Values Used</h3>
                    {results.estimatedBP && (
                      <p className="text-sm text-amber-700">• Blood Pressure: {results.estimatedBP} (estimated)</p>
                    )}
                    {results.estimatedBPM && (
                      <p className="text-sm text-amber-700">• Heart Rate: {results.estimatedBPM} BPM (estimated)</p>
                    )}
                    <p className="text-xs text-amber-600 mt-2">
                      Please consult your doctor for accurate measurements and personalized advice.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Caffeine Limits */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Daily Caffeine Limit</h2>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 mb-6">
                <p className="text-lg mb-2">Maximum Safe Caffeine</p>
                <p className="text-5xl font-bold">{results.maxCaffeine} mg</p>
                <p className="text-sm opacity-90 mt-2">per day</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
                  <Coffee className="w-8 h-8 text-amber-600 mb-2" />
                  <p className="text-3xl font-bold text-gray-800">{results.coffeeCups}</p>
                  <p className="text-sm text-gray-600">Cups of Coffee</p>
                  <p className="text-xs text-gray-500 mt-1">(95mg each)</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                  <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-3xl font-bold text-gray-800">{results.energyDrinks}</p>
                  <p className="text-sm text-gray-600">Energy Drinks</p>
                  <p className="text-xs text-gray-500 mt-1">(180mg each)</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                  <AlertCircle className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-3xl font-bold text-gray-800">{results.caffeinePills}</p>
                  <p className="text-sm text-gray-600">Caffeine Pills</p>
                  <p className="text-xs text-gray-500 mt-1">(200mg each)</p>
                </div>
              </div>
            </div>

            {/* AI Schedule */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">AI-Optimized Intake Schedule</h2>
              </div>
              <div className="space-y-3">
                {results.schedule.map((item, idx) => {
                  const amount = Number(item.amount);
                  
                  // Calculate best whole number option for each type
                  const cupsRaw = amount / 95;
                  const energyDrinksRaw = amount / 180;
                  const pillsRaw = amount / 200;
                  
                  // Find which option gives us the closest match with whole numbers
                  const cupsRounded = Math.round(cupsRaw);
                  const energyRounded = Math.round(energyDrinksRaw);
                  const pillsRounded = Math.max(1, Math.round(pillsRaw)); // Pills minimum 1
                  
                  const cupsDiff = Math.abs(cupsRounded * 95 - amount);
                  const energyDiff = Math.abs(energyRounded * 180 - amount);
                  const pillsDiff = Math.abs(pillsRounded * 200 - amount);
                  
                  // Pick the best match
                  let suggestion = '';
                  if (cupsDiff <= energyDiff && cupsDiff <= pillsDiff && cupsRounded > 0) {
                    suggestion = `☕ ${cupsRounded} cup${cupsRounded !== 1 ? 's' : ''} coffee`;
                  } else if (energyDiff <= pillsDiff && energyRounded > 0) {
                    suggestion = `⚡ ${energyRounded} energy drink${energyRounded !== 1 ? 's' : ''}`;
                  } else if (pillsRounded > 0) {
                    suggestion = `💊 ${pillsRounded} pill${pillsRounded !== 1 ? 's' : ''}`;
                  }
                  
                  // Also show alternatives
                  const alternatives = [];
                  if (cupsRounded > 0 && !suggestion.includes('coffee')) {
                    alternatives.push(`${cupsRounded} coffee`);
                  }
                  if (energyRounded > 0 && !suggestion.includes('energy')) {
                    alternatives.push(`${energyRounded} energy drink`);
                  }
                  if (pillsRounded > 0 && !suggestion.includes('pill')) {
                    alternatives.push(`${pillsRounded} pill`);
                  }
                  
                  return (
                    <div key={idx} className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{item.time}</p>
                          <p className="text-sm text-gray-600">{item.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{amount}mg</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-xs text-gray-600 mb-1 font-semibold">Best option:</p>
                        <div className="mb-2">
                          <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                            {suggestion}
                          </span>
                        </div>
                        {alternatives.length > 0 && (
                          <>
                            <p className="text-xs text-gray-500 mb-1">Or:</p>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                              {alternatives.map((alt, i) => (
                                <span key={i} className="bg-white px-2 py-1 rounded">{alt}</span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * Avoid caffeine 6+ hours before bedtime for better sleep quality
              </p>
            </div>

            {/* Beer Limit (Fun) */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Beer className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Just For Fun: Beer Edition 🍺</h2>
              </div>
              <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
                <p className="text-lg mb-2">Maximum beers before productivity drops:</p>
                <p className="text-6xl font-bold mb-2">{results.beerLimit}</p>
                <p className="text-sm opacity-90">standard beers (341ml, 5% ABV)</p>
              </div>
              <p className="text-sm mt-4 opacity-90">
                ⚠️ This is purely educational and for entertainment. Always drink responsibly and never drink and drive!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}