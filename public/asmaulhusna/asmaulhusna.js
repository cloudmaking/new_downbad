const names = [
    { number: 1, name: "Ar-Rahmaan", meaning: "The Beneficent", message: "Remember to always show kindness and mercy to those around you." },
    { number: 2, name: "Ar-Raheem", meaning: "The Merciful", message: "Forgive others and seek forgiveness from Allah, the most Merciful." },
    { number: 3, name: "Al-Malik", meaning: "The King", message: "Allah is the King of all kings, trust in His wisdom and rule." },
    { number: 4, name: "Al-Quddus", meaning: "The Most Sacred", message: "Strive for purity in your actions and thoughts." },
    { number: 5, name: "As-Salam", meaning: "The Source of Peace", message: "Seek peace within yourself and spread it to others." },
    { number: 6, name: "Al-Mu’min", meaning: "The Inspirer of Faith", message: "Strengthen your faith through reflection and prayer." },
    { number: 7, name: "Al-Muhaymin", meaning: "The Guardian", message: "Trust in Allah’s protection and guidance in all matters." },
    { number: 8, name: "Al-Aziz", meaning: "The Almighty", message: "Remember Allah’s power and seek strength through Him." },
    { number: 9, name: "Al-Jabbar", meaning: "The Compeller", message: "Understand that Allah can compel and rectify all affairs." },
    { number: 10, name: "Al-Mutakabbir", meaning: "The Dominant One", message: "Acknowledge Allah’s greatness and submit to His will." },
    { number: 11, name: "Al-Khaliq", meaning: "The Creator", message: "Reflect on Allah’s creation and be grateful for His bounties." },
    { number: 12, name: "Al-Bari", meaning: "The Evolver", message: "Witness the evolution of creation as a sign of Allah’s creativity." },
    { number: 13, name: "Al-Musawwir", meaning: "The Flawless Shaper", message: "Appreciate the beauty and uniqueness of Allah’s creations." },
    { number: 14, name: "Al-Ghaffar", meaning: "The Great Forgiver", message: "Seek forgiveness often and forgive others generously." },
    { number: 15, name: "Al-Qahhar", meaning: "The All-Prevailing One", message: "Remember that Allah’s power can overcome any challenge." },
    { number: 16, name: "Al-Wahhab", meaning: "The Supreme Bestower", message: "Be generous and share the blessings Allah has bestowed upon you." },
    { number: 17, name: "Ar-Razzaq", meaning: "The Total Provider", message: "Trust in Allah’s provision and work diligently." },
    { number: 18, name: "Al-Fattah", meaning: "The Opener / The Judge", message: "Seek new opportunities and trust Allah to open the right doors." },
    { number: 19, name: "Al-Alim", meaning: "The All-Knowing", message: "Seek knowledge and wisdom from Allah, the source of all knowledge." },
    { number: 20, name: "Al-Qabid", meaning: "The Constrictor", message: "In times of hardship, remember that Allah controls all situations." },
    { number: 21, name: "Al-Basit", meaning: "The Extender", message: "In times of ease, be thankful and generous to others." },
    { number: 22, name: "Al-Khafid", meaning: "The Reducer", message: "Stay humble, knowing that Allah can lower the proud." },
    { number: 23, name: "Ar-Rafi", meaning: "The Exalter", message: "Seek to elevate yourself through good deeds and piety." },
    { number: 24, name: "Al-Mu’izz", meaning: "The Honourer-Bestower", message: "Honour others and seek honour through Allah’s grace." },
    { number: 25, name: "Al-Mudhill", meaning: "The Dishonourer", message: "Avoid actions that lead to dishonour and disgrace." },
    { number: 26, name: "As-Sami", meaning: "The All-Hearing", message: "Pray with sincerity, knowing that Allah hears all prayers." },
    { number: 27, name: "Al-Basir", meaning: "The All-Seeing", message: "Act with integrity, knowing that Allah sees all that you do." },
    { number: 28, name: "Al-Hakam", meaning: "The Impartial Judge", message: "Strive for justice in your actions and trust in Allah’s judgment." },
    { number: 29, name: "Al-Adl", meaning: "The Embodiment of Justice", message: "Be fair in your dealings and seek justice for others." },
    { number: 30, name: "Al-Lateef", meaning: "The Subtle One", message: "Notice the subtle blessings in your life and be grateful." },
    { number: 31, name: "Al-Khabir", meaning: "The All-Aware", message: "Be aware of your actions and their impact on others." },
    { number: 32, name: "Al-Haleem", meaning: "The Forbearing", message: "Practice patience and forbearance in difficult situations." },
    { number: 33, name: "Al-Azim", meaning: "The Magnificent", message: "Reflect on the magnificence of Allah in all creation." },
    { number: 34, name: "Al-Ghafur", meaning: "The Forgiving", message: "Seek Allah’s forgiveness and strive to forgive others." },
    { number: 35, name: "Ash-Shakur", meaning: "The Appreciative", message: "Show gratitude for Allah’s blessings and thank others." },
    { number: 36, name: "Al-Aliyy", meaning: "The Most High", message: "Exalt Allah in your heart and actions." },
    { number: 37, name: "Al-Kabeer", meaning: "The Most Great", message: "Recognize Allah’s greatness in all aspects of life." },
    { number: 38, name: "Al-Hafiz", meaning: "The Preserver", message: "Trust that Allah is preserving you and protecting you." },
    { number: 39, name: "Al-Muqit", meaning: "The Sustainer", message: "Rely on Allah for sustenance and support." },
    { number: 40, name: "Al-Haseeb", meaning: "The Reckoner", message: "Be mindful of your actions, knowing you will be accountable." },
    { number: 41, name: "Al-Jalil", meaning: "The Majestic", message: "Honor Allah’s majesty in your worship and daily life." },
    { number: 42, name: "Al-Karim", meaning: "The Generous", message: "Emulate Allah’s generosity by giving to others." },
    { number: 43, name: "Ar-Raqib", meaning: "The Watchful", message: "Be aware that Allah is watching over you at all times." },
    { number: 44, name: "Al-Mujib", meaning: "The Responsive", message: "Call upon Allah with sincerity, knowing He will respond." },
    { number: 45, name: "Al-Wasi", meaning: "The All-Encompassing", message: "Feel comforted that Allah’s mercy and knowledge encompass all." },
    { number: 46, name: "Al-Hakim", meaning: "The All-Wise", message: "Seek wisdom through Allah and act with discernment." },
    { number: 47, name: "Al-Wadud", meaning: "The Most Loving", message: "Show love and compassion to others as Allah does." },
    { number: 48, name: "Al-Majid", meaning: "The All-Glorious", message: "Celebrate the glory of Allah in your thoughts and actions." },
    { number: 49, name: "Al-Ba’ith", meaning: "The Resurrector", message: "Have faith in the resurrection and Allah’s power to revive." },
    { number: 50, name: "Ash-Shahid", meaning: "The Witness", message: "Live righteously, knowing that Allah witnesses all deeds." },
    { number: 51, name: "Al-Haqq", meaning: "The Absolute Truth", message: "Seek truth in all matters and align with Allah’s truth." },
    { number: 52, name: "Al-Wakeel", meaning: "The Trustee", message: "Place your trust in Allah in all affairs." },
    { number: 53, name: "Al-Qawiyy", meaning: "The Most Strong", message: "Draw strength from Allah in times of weakness." },
    { number: 54, name: "Al-Matin", meaning: "The Firm", message: "Stand firm in your faith and principles." },
    { number: 55, name: "Al-Waliyy", meaning: "The Protecting Friend", message: "Find comfort in Allah’s protection and friendship." },
    { number: 56, name: "Al-Hamid", meaning: "The Praiseworthy", message: "Praise Allah often and express gratitude." },
    { number: 57, name: "Al-Muhsi", meaning: "The Reckoner", message: "Keep account of your deeds and seek improvement." },
    { number: 58, name: "Al-Mubdi", meaning: "The Originator", message: "Appreciate Allah’s creativity and seek to be innovative." },
    { number: 59, name: "Al-Mu’id", meaning: "The Restorer", message: "Trust Allah to restore what is lost or broken." },
    { number: 60, name: "Al-Muhyi", meaning: "The Giver of Life", message: "Value the life Allah has given you and live it fully." },
    { number: 61, name: "Al-Mumit", meaning: "The Inflicter of Death", message: "Remember the temporary nature of this life and prepare for the hereafter." },
    { number: 62, name: "Al-Hayy", meaning: "The Ever-Living", message: "Find strength and comfort in the ever-living presence of Allah." },
    { number: 63, name: "Al-Qayyum", meaning: "The Self-Subsisting", message: "Rely on Allah’s eternal support and sustenance." },
    { number: 64, name: "Al-Wajid", meaning: "The Finder", message: "Seek Allah in all aspects of life and you will find Him." },
    { number: 65, name: "Al-Majid", meaning: "The Noble", message: "Emulate the nobility and dignity of Allah in your actions." },
    { number: 66, name: "Al-Wahid", meaning: "The Unique", message: "Appreciate the uniqueness of Allah and His creation." },
    { number: 67, name: "Al-Ahad", meaning: "The Incomparable", message: "Recognize the oneness of Allah in all that you do." },
    { number: 68, name: "As-Samad", meaning: "The Eternal", message: "Depend on Allah’s eternal presence and support." },
    { number: 69, name: "Al-Qadir", meaning: "The All-Powerful", message: "Trust in Allah’s limitless power and capability." },
    { number: 70, name: "Al-Muqtadir", meaning: "The Enforcer", message: "Draw upon Allah’s power to overcome challenges." },
    { number: 71, name: "Al-Muqaddim", meaning: "The Expediter", message: "Trust Allah’s timing in all matters." },
    { number: 72, name: "Al-Mu’akhkhir", meaning: "The Delayer", message: "Be patient and trust in Allah’s wisdom in delays." },
    { number: 73, name: "Al-Awwal", meaning: "The First", message: "Recognize Allah’s primacy in all creation." },
    { number: 74, name: "Al-Akhir", meaning: "The Last", message: "Understand that Allah will remain after all else perishes." },
    { number: 75, name: "Az-Zahir", meaning: "The Manifest", message: "See Allah’s signs in the manifest world around you." },
    { number: 76, name: "Al-Batin", meaning: "The Hidden", message: "Seek Allah in the hidden aspects of life and your soul." },
    { number: 77, name: "Al-Wali", meaning: "The Holder of Supreme Authority", message: "Find solace in Allah’s guidance and protection." },
    { number: 78, name: "Al-Muta’ali", meaning: "The Self Exalted", message: "Exalt Allah above all and seek His pleasure." },
    { number: 79, name: "Al-Barr", meaning: "The Source of All Goodness", message: "Emulate Allah’s kindness and righteousness in your life." },
    { number: 80, name: "At-Tawwab", meaning: "The Acceptor of Repentance", message: "Return to Allah often through repentance." },
    { number: 81, name: "Al-Muntaqim", meaning: "The Avenger", message: "Seek justice through Allah and trust in His retribution." },
    { number: 82, name: "Al-Afu", meaning: "The Pardoner", message: "Seek pardon from Allah and be willing to pardon others." },
    { number: 83, name: "Ar-Ra’uf", meaning: "The Most Kind", message: "Show kindness to others, reflecting Allah’s kindness." },
    { number: 84, name: "Malik-ul-Mulk", meaning: "Master of the Kingdom", message: "Acknowledge Allah’s sovereignty over all kingdoms." },
    { number: 85, name: "Dhul-Jalal Wal-Ikram", meaning: "Lord of Glory and Honour", message: "Honor Allah’s glory and seek to live honorably." },
    { number: 86, name: "Al-Muqsit", meaning: "The Just One", message: "Strive for justice in your actions and dealings." },
    { number: 87, name: "Al-Jami", meaning: "The Gatherer", message: "Trust in Allah’s ability to gather and unite hearts." },
    { number: 88, name: "Al-Ghani", meaning: "The Self-Sufficient", message: "Seek sufficiency in Allah and rely on Him." },
    { number: 89, name: "Al-Mughni", meaning: "The Fulfiller of Needs", message: "Be grateful for Allah’s enrichment and share with others." },
    { number: 90, name: "Al-Mani’", meaning: "The Protector", message: "Trust Allah’s wisdom in preventing certain outcomes." },
    { number: 91, name: "Ad-Darr", meaning: "The Punisher", message: "Seek refuge in Allah during times of distress." },
    { number: 92, name: "An-Nafi’", meaning: "The Creator of Good", message: "Seek beneficial outcomes through Allah’s guidance." },
    { number: 93, name: "An-Nur", meaning: "The Light", message: "Seek Allah’s light in times of darkness." },
    { number: 94, name: "Al-Hadi", meaning: "The Guide", message: "Seek Allah’s guidance in all aspects of life." },
    { number: 95, name: "Al-Badi", meaning: "The Incomparable", message: "Appreciate the uniqueness and beauty of Allah’s creation." },
    { number: 96, name: "Al-Baqi", meaning: "The Everlasting", message: "Find comfort in Allah’s everlasting presence." },
    { number: 97, name: "Al-Warith", meaning: "The Inheritor", message: "Trust that Allah will inherit and take care of all matters." },
    { number: 98, name: "Ar-Rashid", meaning: "The Righteous Teacher", message: "Seek Allah’s guidance and righteousness." },
    { number: 99, name: "As-Sabur", meaning: "The Patient", message: "Practice patience, knowing Allah’s plan is perfect." }
];
document.addEventListener("DOMContentLoaded", () => {
    const namesContainer = document.getElementById("names-container");
    const popup = document.getElementById("popup");
    const popupName = document.getElementById("popup-name");
    const popupMeaning = document.getElementById("popup-meaning");
    const popupMessage = document.getElementById("popup-message");
    const closeBtn = document.getElementById("close-btn");
    const homeButton = document.getElementById("homeButton");
    const leftArrow = document.getElementById("left-arrow");
    const rightArrow = document.getElementById("right-arrow");

    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    // Check if popupMessage element exists
    if (!popupMessage) {
        console.error("Element with id 'popup-message' not found.");
        return;
    }

    // Navigate to home page when home button is clicked
    homeButton.addEventListener("click", () => {
        window.location.href = '/';
    });

    // Populate the names container with the names
    names.forEach((nameObj, index) => {
        const nameElement = document.createElement("div");
        nameElement.classList.add("name-item");
        nameElement.innerHTML = `<div class="name-number">${nameObj.number}</div><div class="name-text">${nameObj.name}</div>`;
        nameElement.addEventListener("click", () => {
            currentIndex = index;
            showPopup(nameObj);
        });
        namesContainer.appendChild(nameElement);
    });

    // Show the popup with the name details
    function showPopup(nameObj) {
        popupName.textContent = nameObj.name;
        popupMeaning.textContent = nameObj.meaning;
        popupMessage.textContent = nameObj.message;
        popup.classList.remove("hidden");
    }

    // Close the popup when the close button is clicked
    closeBtn.addEventListener("click", () => {
        popup.classList.add("hidden");
    });

    // Close the popup when clicking outside the popup content
    window.addEventListener("click", (e) => {
        if (e.target === popup) {
            popup.classList.add("hidden");
        }
    });

    // Show the next name
    rightArrow.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % names.length;
        showPopup(names[currentIndex]);
    });

    // Show the previous name
    leftArrow.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + names.length) % names.length;
        showPopup(names[currentIndex]);
    });

    // Handle touch start event
    popup.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    // Handle touch end event
    popup.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    // Handle swipe gestures
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left
            currentIndex = (currentIndex + 1) % names.length;
            showPopup(names[currentIndex]);
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right
            currentIndex = (currentIndex - 1 + names.length) % names.length;
            showPopup(names[currentIndex]);
        }
    }
});
