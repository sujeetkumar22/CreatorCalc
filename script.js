// script.js

// ---------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------
// REPLACE THESE WITH YOUR ACTUAL SUPABASE KEYS WHEN READY
const supabaseUrl = 'https://plpsqgvsquasicvrwhyb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBscHNxZ3ZzcXVhc2ljdnJ3aHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDY1ODksImV4cCI6MjA4NDU4MjU4OX0.y5P_iRdX2BFAYsCH0e-v572KW2sjyyMbP8Axpn73S9A';

// Initialize Supabase SAFELY
let supabaseClient = null;
try {
    // Check if keys are still placeholders or missing
    if (typeof supabase === 'undefined') {
        console.warn("Supabase SDK not loaded via CDN.");
    } else if (supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || supabaseUrl === '') {
        console.warn("Supabase keys not set. Database features will be disabled, but calculator will work.");
    } else {
        // Only try to connect if keys look real
        supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
        console.log("Supabase connected successfully.");
    }
} catch (err) {
    console.error("Supabase initialization failed:", err);
    // We catch the error so the rest of the script (calculator) keeps running!
}

// ---------------------------------------------------------
// 2. MARKET DATA
// ---------------------------------------------------------
const cpmRates = {
    "tech": 500, "finance": 800, "beauty": 450, "health": 400,
    "travel": 400, "food": 350, "lifestyle": 250, "gaming": 150
};
const productionFees = {
    "tech": 950, "finance": 800, "beauty": 700, "health": 700,
    "travel": 700, "food": 650, "lifestyle": 700, "gaming": 600
};
const rightsMultipliers = { "social": 1.0, "full": 1.5, "perpetual": 2.0 };

// ---------------------------------------------------------
// 3. CALCULATION LOGIC
// ---------------------------------------------------------
function calculateRate() {
    console.log("Calculate started..."); // Debug log

    // 1. Get Elements
    const viewsInput = document.getElementById("viewsInput");
    const nicheSelect = document.getElementById("nicheSelect");
    // Updated selector to match your specific HTML structure
    const rightsInput = document.querySelector('input[name="rights"]:checked');

    if (!viewsInput || !nicheSelect) {
        console.error("Critical elements missing from HTML.");
        return;
    }

    // 2. Get Values
    // Note: input type="number" doesn't usually have commas, but we strip them just in case
    let rawViews = viewsInput.value;
    let views = parseFloat(rawViews.replace(/,/g, ''));
    let niche = nicheSelect.value;
    // Default to 'social' if no radio is checked
    let rights = rightsInput ? rightsInput.value : "social"; 
    
    // Fallback: Check if values in dropdown match keys in cpmRates. 
    // Your HTML has "Tech & Engineering" but JS keys are "tech". We need to map them.
    // simpler way: lower case the first word
    let nicheKey = niche.split(' ')[0].toLowerCase(); 
    // Manual mapping if simple splitting fails
    if (niche.includes("Tech")) nicheKey = "tech";
    else if (niche.includes("Finance")) nicheKey = "finance";
    else if (niche.includes("Beauty")) nicheKey = "beauty";
    else if (niche.includes("Health")) nicheKey = "health";
    else if (niche.includes("Travel")) nicheKey = "travel";
    else if (niche.includes("Food")) nicheKey = "food";
    else if (niche.includes("Lifestyle")) nicheKey = "lifestyle";
    else if (niche.includes("Gaming")) nicheKey = "gaming";

    console.log("Parsed Inputs:", { views, nicheKey, rights });

    // 3. Validation
    if (isNaN(views)) {
        alert("Please enter a valid number for views.");
        return;
    }
    if (views < 1000) {
        alert("Please enter a minimum of 1,000 views.");
        return;
    }

    // 4. Calculate
    const cpm = cpmRates[nicheKey] || 250; // Default to 250 if no match
    const baseRate = (views / 1000) * cpm;
    const avgProdFee = productionFees[nicheKey] || 700;
    const multiplier = rightsMultipliers[rights] || 1.0;

    const totalAvg = (baseRate + avgProdFee) * multiplier;
    const totalMin = totalAvg * 0.80;
    const totalMax = totalAvg * 1.50;

    // 5. Update UI
    const fmt = (num) => num.toLocaleString('en-IN', { 
        style: 'currency', 
        currency: 'INR', 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    });

    // Helper to safely set text
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setText("price-result", fmt(totalAvg).replace(/[^\d.,]/g, '').trim());
    setText("min-price", fmt(totalMin));
    setText("avg-price", fmt(totalAvg));
    setText("max-price", fmt(totalMax));
    setText("baseRateDisplay", fmt(baseRate));
    setText("prodFeeDisplay", fmt(avgProdFee));
    setText("rightsMultDisplay", multiplier + "x Applied");
}

// ---------------------------------------------------------
// 4. MODAL WORKFLOW
// ---------------------------------------------------------
function openModal(modalId) {
    if (modalId === 'leadModal') {
        const priceElement = document.getElementById("price-result");
        if(!priceElement || priceElement.innerText === "0.00" || priceElement.innerText === "0") {
            alert("Please calculate a value before downloading.");
            return;
        }
    }
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.remove("hidden");
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.add("hidden");
}

async function submitAndDownload() {
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const insta = document.getElementById("userInsta").value;
    const phone = document.getElementById("userPhone").value;
    const price = document.getElementById("price-result").innerText;
    const submitBtn = document.getElementById("submitBtn");

    if(!name || !email || !insta) {
        alert("Please fill in Name, Email and Instagram.");
        return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Saving... <span class='material-symbols-outlined animate-spin'>progress_activity</span>";

    // Only try to save if Supabase is actually connected
    if(supabaseClient) {
        try {
            await supabaseClient.from('leads').insert({ 
                name: name, email: email, instagram: insta, phone: phone, quote_price: price 
            });
        } catch (err) { console.error("DB Save Error:", err); }
    } else {
        console.warn("Skipping DB save (Supabase not configured).");
    }

    const target = document.getElementById("capture-target");
    if (typeof html2canvas !== 'undefined') {
        html2canvas(target, { backgroundColor: "#050505", scale: 2 }).then(canvas => {
            const link = document.createElement('a');
            link.download = `CreatorCalc_Quote_${insta}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();

            submitBtn.innerHTML = originalText;
            closeModal('leadModal');
            openModal('surveyModal'); 
        });
    } else {
        alert("Error: html2canvas library not loaded.");
        submitBtn.innerHTML = originalText;
    }
}

async function submitSurvey() {
    const email = document.getElementById("userEmail").value;
    const niche = document.getElementById("surveyNiche").value;
    const experience = document.getElementById("surveyExp").value;

    if(!niche || !experience) {
        alert("Please select an option for both questions.");
        return;
    }

    if(supabaseClient && email) {
        supabaseClient
            .from('leads')
            .update({ niche_category: niche, experience_level: experience })
            .eq('email', email)
            .then(() => console.log("Survey saved"));
    }

    document.getElementById("surveyQuestions").classList.add("hidden");
    document.getElementById("surveyResult").classList.remove("hidden");
}

function copyTemplate() {
    const text = document.getElementById("pitchTemplate");
    text.select();
    text.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(text.value);

    const btn = document.getElementById("copyBtn");
    btn.innerHTML = `<span class="material-symbols-outlined text-sm">check</span> Copied!`;
    btn.classList.replace("bg-[#8a2ce2]", "bg-green-600");

    setTimeout(() => {
        btn.innerHTML = `<span class="material-symbols-outlined text-sm">content_copy</span> Copy`;
        btn.classList.replace("bg-green-600", "bg-[#8a2ce2]");
    }, 2000);
}

// ---------------------------------------------------------
// 5. INITIALIZATION
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized");

    const calcBtn = document.getElementById("calcBtn");
    if(calcBtn) {
        calcBtn.addEventListener("click", calculateRate);
    } else {
        console.error("Error: Calculate Button not found");
    }
    
    // Allow pressing "Enter" in the views input
    const viewsInput = document.getElementById("viewsInput");
    if(viewsInput) {
        viewsInput.addEventListener("keypress", (e) => { 
            if (e.key === "Enter") calculateRate(); 
        });
    }
});