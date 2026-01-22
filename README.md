# ⚡ CreatorCalc - The Creator Pricing Standard

> **Stop Guessing. Know Your Worth.** > An algorithmic pricing dashboard that helps Indian content creators calculate fair market value for brand sponsorships.

<img width="1792" height="1220" alt="CreatorCalc_Quote_sujeetkumar____" src="https://github.com/user-attachments/assets/23c478c5-e445-4636-8f8d-de1c43f7775b" />


## 🚀 About The Project

**CreatorCalc** is a tool designed to solve the biggest problem in the Creator Economy: **Pricing Transparency**. 

Most creators undercharge because they don't know the market rates. This dashboard uses a weighted algorithm considering **CPM (Cost Per Mille)**, **Production Overhead**, and **Usage Rights** to generate a data-backed quote.

It also serves as a high-converting **Lead Generation Tool**, capturing creator data (Email, WhatsApp, Instagram) and storing it in a real-time database before allowing them to download their official valuation card.

### Key Features
* **📊 Dynamic Valuation Algorithm:** Calculates rates based on Niche (Tech, Finance, Beauty, etc.) and average views.
* **📝 Usage Rights Multiplier:** Automatically adjusts pricing for Social Only vs. Perpetual usage rights.
* **📸 Image Generation:** Uses `html2canvas` to render a downloadable, professional "Quote Card" for negotiations.
* **🗄️ Backend Integration:** Connected to **Supabase** (PostgreSQL) to store user leads and survey data securely.
* **📱 WhatsApp Marketing:** Integrated flow to drive users into a WhatsApp Community.
* **🎁 Incentive System:** Unlocks a "Winning Brand Pitch Template" after the user completes a survey.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, Tailwind CSS (via CDN)
* **Logic:** Vanilla JavaScript (ES6+)
* **Database:** Supabase (PostgreSQL)
* **Libraries:** * `html2canvas` (Screenshot generation)
    * `Google Fonts` (Inter & JetBrains Mono)
    * `Material Symbols` (Icons)

---

## ⚙️ How to Run Locally

Since this project uses vanilla HTML/JS, you don't need `npm` or `react` to run it.

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/creator-calc.git](https://github.com/YOUR_USERNAME/creator-calc.git)
    cd creator-calc
    ```

2.  **Configure the Database**
    * Rename `script.js` (if needed) and ensure your **Supabase Keys** are set.
    * *Note: For security, never commit your private Service Role keys. This project uses the public `anon` key which is safe for client-side use with RLS.*

3.  **Launch**
    * Simply open `index.html` in your browser.
    * OR use a live server (VS Code Extension "Live Server") for the best experience.

---

## 🗄️ Database Schema (Supabase)

This project connects to a table named `leads`.

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `id` | int8 | Primary Key |
| `created_at` | timestamp | Auto-generated |
| `name` | text | Creator's Name |
| `email` | text | Email Address |
| `instagram` | text | Instagram Handle |
| `phone` | text | WhatsApp Number |
| `quote_price` | text | Calculated Value (e.g. ₹50,000) |
| `niche_category` | text | Survey Answer 1 |
| `experience_level` | text | Survey Answer 2 |

---

## 🔮 Future Roadmap

* [ ] **Admin Dashboard:** A login portal to view all leads and sort them by price.
* [ ] **Auth Integration:** Allow creators to sign in with Google to save their history.
* [ ] **PDF Invoicing:** Generate a full PDF contract instead of just an image.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:
1.  Fork the project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.



---

### 📬 Contact

**Sujeet Kumar** [LinkedIn](www.linkedin.com/in/sujeet-kumar-3979841b8)
Project Link: [https://github.com/sujeetkumar22/CreatorCalc]
