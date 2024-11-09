const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
const https = require('https');
const { promisify } = require('util');
const fetch = require('node-fetch');
const cors = require('cors')({ origin: true });
const path = require('path');
const os = require('os');
const fs = require('fs').promises;
const fsdemo = require('fs');
const { createReadStream } = require('fs');
const { unlinkSync } = require('fs');

const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const mammoth = require('mammoth');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const processorName = 'projects/156055018925/locations/us/processors/5969a7ac870d74aa';
const stripe = require('stripe')('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');
const OpenAI = require('openai');
const { exec } = require('child_process');
const Epub = require('epub');
const WebSocket = require('ws');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const express = require("express");
admin.initializeApp();
const app = express();
app.use(express.json());
const db = admin.database();
const dbf = admin.firestore();
const storage = admin.storage();
const secondBucket = admin.storage().bucket('adhd-buddy');
const axios = require('axios');
const FormData = require('form-data');
const streamToBuffer = require('stream-to-buffer');
const EventSource = require('eventsource');

//const { Configuration, OpenAIApi } = require("openai");
const OpenAINew = require('openai');
const bucket = admin.storage().bucket();
const stream = require('stream');
const util = require('util');
const PDFDocument = require('pdfkit');


const glob = require('glob');
const cheerio = require('cheerio');

//add functions
//const newUserSignUp = require('./newUser');
//exports.newUserSignUp = newUserSignUp;
//const newTaskifyReq = require('./detaskify');
//exports.newTaskifyReq = newTaskifyReq;
//const extractAudioFN = require('./gathermind');
//exports.extractAudioFN = extractAudioFN;
//const surveyResponse = require('./adhdsurvey');
//exports.surveyResponse = surveyResponse;
//const dailyJob = require('./daily');
//exports.dailyJob = dailyJob;
//const dailyPlan = require('./dailyplan'); - czasowo wyłączone
//exports.dailyPlan = dailyPlan;
//const getPublicUrl = require('./publicurl');
//exports.getPublicUrl = getPublicUrl;
//const updateICSFile = require('./updatecal');
//exports.updateICSFile = updateICSFile;
//const processIcsFile = require('./calendar');
//exports.processIcsFile = processIcsFile;
//const deleteEventFromICSFile = require('./deleteEventFromICS');
//exports.deleteEventFromICSFile = deleteEventFromICSFile;
//const gathermindContekst = require('./gathermindContekst');
//exports.gathermindContekst = gathermindContekst;


// Konfiguracja OpenAI
//const configuration = new Configuration({
//  apiKey: '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', // Użyj swojego klucza API
//});
//const openai = new OpenAIApi(configuration);

const openai = new OpenAINew({
  apiKey: 'sk-proj-ZqnrHngiZsx2EW2BYJQsT3BlbkFJyfLgNHCd7jSVAO7a4prR',
  organization: "org-z9fJ6A6OfS5yodEX7325zIK0",
  project: "proj_iavWeBjbyR4KrO0c0e7j0mMQ",
});

const openaiApiKey = 'sk-proj-ZqnrHngiZsx2EW2BYJQsT3BlbkFJyfLgNHCd7jSVAO7a4prR'; // Replace with your actual OpenAI API key




// Function to sleep for a specified duration
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const addprompt = " propozycję wykonania testów dodatkowych oraz, jeżeli jest to uzasadnione wynikami testu, zasugerowanie wsparcia psychologa lub skorzystanie z Coachingu ADHD. Jezeli zasugerujesz dodatkowe testy, podaj rekomendacje podając link https://https://neuroinsights.me/ natomiast jeżeli zasugerujesz coaching, zarekomenduj i podaj link: https://neuroinsights.me/coaching . ";

exports.newUserSignUp = functions.region('europe-central2').auth.user().onCreate(async (user) => {
  // tu możesz przeprowadzić operacje związane z nowym użytkownikiem
  console.log('Użytkownik zarejestrowany: ', user.email, user.uid, user.displayName);
  // Zapisywanie danych do Firestore
const saveDataToFirestore = async () => {
try {
  // Dane do zapisania
  const data = {
    resetTime: admin.database.ServerValue.TIMESTAMP,
    displayName: user.displayName,
    gmTimeLimit: 10,
    gmSizeLimit: 20,
    TotalConsumedTokens: 0,
    limitTokens: 100000,
    actual_points: 0,
    limitPoints: 100,
    active: 1,
    activeCv: 0,
    activeNeuroInsights: 0,
    typeAccount: "Beta",
  };
  const datamailer = {
    emailAddress: user.email,
    firstName: user.displayName,
  };
  const datamailerSendGrid = {
    email: user.email,
    firstName: user.displayName,
  };

  // Ścieżka do kolekcji i identyfikator dokumentu
  const collectionPath = 'customers/' + user.uid + '/userdata';
  const collectionPathMailer = 'registrations/';
  const collectionPathSendGrid = 'contacts/';
  console.log('SendGrid: ' + collectionPathSendGrid)

  const documentId = 'limits';
  
  // Zapis danych w określonym dokumencie
  await firestoredb.collection(collectionPath).doc(documentId).set(data);
  await firestoredb.collection(collectionPathMailer).doc(user.uid).set(datamailer);
  await firestoredb.collection(collectionPathSendGrid).doc(user.uid).set(datamailerSendGrid);

  console.log('Dane zapisane do Firestore' + datamailerSendGrid);
} catch (error) {
  console.error('Błąd podczas zapisywania danych do Firestore:', error);
}
};

// Wywołanie funkcji zapisu danych
saveDataToFirestore();

  //if (user.email) {
  //  await admin.auth().updateUser(user.uid, {disabled: true});
  //}

  db.ref('secdata/'+ user.uid + '/personal').set({
    resetTime: admin.database.ServerValue.TIMESTAMP,
    gmTimeLimit: 10,
    gmSizeLimit: 20,
    TotalConsumedTokens: 1,
    limitTokens: 100000,
    actual_points: 0,
    limitPoints: 100,
    active: 1,
    typeAccount: "Beta"
  });
  let uid = user.uid;
  checkAndCreateAssistant(uid);
});


exports.surveyResponse = functions.region('europe-central2').runWith({ timeoutSeconds: 500 }).https.onCall(async (data, context) => {
  try {
    const text = data.data.map(obj => `Q: ${obj.Q}\nA: ${obj.A}`).join('\n\n');
    const uidSave = data.uidSave;
    console.log('uidSave: ' + uidSave);

    const prompt = 'Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedz. Przeanalizuj odpowiedzi i oceń w skali od 1 do 10 stopień ADHD pod kątem impulsywności oraz nieuważności u osoby dorosłej. Przygotuj rozbudowany analityczny komentarz zawierający podsumowanie objawów ADHD wraz z krótkim podsumowaniem i rekomendacją zwłaszcza' + addprompt +  'Podsumowanie powinno być rozbudowane i odnosić sie do wiedzy profesjonalnej w obszarze ADHD. Proszę podaj odpowiedź w formacie JSON, który zawiera trzy pola: "impulsivity" (wartość liczbowa), "inattention" (wartość liczbowa) oraz "comment" (komentarz wraz z analizą i krótką rekomendacją). Przykład odpowiedzi: {"impulsivity": 7, "inattention": 5, "comment": "Szczegółowe Podsumowanie i rekomendacja. Odpowiedz podaj w tagach <b> oraz <p> dzieląc odpowiedz na sekcje."}. Tutaj znajdują się odpowiedzi i pytania:' + text;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });
    console.log("przed parsowaniu: " + completion.choices[0].message.content);

    const contentParsed = JSON.parse(completion.choices[0].message.content);


    console.log("po parsowaniu: " + contentParsed);
    //console.log("Parsed: " + contentParsed);
    const ContentShortMail = contentParsed.comment.length > 100 ? contentParsed.comment.substring(0, 100) + '...' : contentParsed.comment;
    const result = {
      impulsivity: contentParsed.impulsivity,
      inattention: contentParsed.inattention,
      comment: contentParsed.comment,
      survey: text,
      date: admin.database.ServerValue.TIMESTAMP,
    };

    //console.log(result);
    await db.ref('secdata/' + uidSave + '/personal').update(result);
    await db.ref('surveys/' + uidSave).update(result);


    //mail
    // Pobierz e-mail użytkownika z Firestore
    // const doc = await admin.firestore().collection('customers').doc(uidSave).get();
    // const email = doc.data().email;
    // await admin.firestore().collection("mail").add({
    //   to: email,
    //   template: {
    //     name: "insightsmail",
    //     data: {
    //       comment: ContentShortMail,
    //     },
    //   },
    // });

    const checkLimitRef = admin.database().ref(`secdata/${uidSave}/personal/adhdTestLimit`);
    try {
      await checkLimitRef.transaction(currentValue => {
        return (currentValue || 0) + 1;
      });
    } catch (error) {
      console.error('Error incrementing check limit:', error);
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }
});

exports.fetchInsightsDataNew = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const uidSave = data.uidSave;
  const testName = data.testName || null; // Pobieramy testName z zapytania, jeśli istnieje
  console.log("uidSave: " + uidSave);
  
  if (!uidSave) {
    console.log("brak uidSave " + uidSave);
    throw new functions.https.HttpsError('unauthenticated', 'Musisz być zalogowany, aby wykonać tę operację.');
  }

  const dbRef = admin.database().ref();
  const results = [];

  // Pobieranie opisów
  const descriptionsSnapshot = await dbRef.child('Neuroinsights/InsightsDescriptions').once('value');
  const descriptions = descriptionsSnapshot.val();

  // Pobieranie danych z Głównego
  const adhdBaseSnapshot = await dbRef.child(`surveys/${uidSave}`).once('value');
  const childData = adhdBaseSnapshot.val();
  console.log("Child snapshot data: ", childData);

  if (childData) {
    const { date, comment, survey } = childData;

    // Jeśli testName nie jest podany lub pasuje do aktualnego testu
    if (!testName || testName === 'Test ADHD Buddy') {
      results.push({
        type: 'free', 
        key: uidSave, 
        subKey: 'ADHDBase', 
        date, 
        comment, 
        survey, 
        description: 'Podstawowy test na Impulsywność i nieuważność', 
        name: 'Test ADHD Buddy'
      });
    }
  } else {
    console.log("No data found for the given uidSave.");
  }

  // Pobieranie danych z Neuroinsights
  const NeuroinsightsSnapshot = await dbRef.child(`Neuroinsights/${uidSave}`).once('value');
  const promises = [];

  NeuroinsightsSnapshot.forEach(childSnapshot => {
    const key = childSnapshot.key;
    const descriptionData = descriptions[key];

    childSnapshot.forEach(grandChildSnapshot => {
      const subKey = grandChildSnapshot.key;
      const { date, comment, survey, wskazniki } = grandChildSnapshot.val();

      const promise = new Promise(async (resolve) => {
        let finalComment = comment;
        if (!comment) {
          const commentNewSnapshot = await dbRef.child(`Neuroinsights/${uidSave}/${key}/commentNew`).once('value');
          const commentNew = commentNewSnapshot.val();
          finalComment = commentNew ? commentNew.Opis : "";
        }

        // Sprawdzamy, czy testName pasuje, jeśli jest podane
        if (!testName || testName === descriptionData?.name) {
          results.push({
            type: descriptionData?.type,
            key,
            subKey,
            date,
            comment: finalComment,
            wskazniki,
            survey,
            description: descriptionData?.description,
            name: descriptionData?.name
          });
        }

        resolve();
      });

      promises.push(promise);
    });
  });

  await Promise.all(promises);

  // Sortowanie wyników rosnąco
  results.sort((a, b) => b.date - a.date);

  // Generowanie HTML
  if (!testName){
  let html = results.map((result, index) => {
    const safeComment = result.comment.replace(/['"]/g, "");
    const safeDescription = result.description.replace(/['"]/g, "");
    const safeName = result.name.replace(/['"]/g, "");
    return `
      <div style='cursor: pointer;' class='insightpos' data-index='${index}' id='insightpos${index}' onclick="handleClick(${index}, '${safeName}', '${safeComment}', '${safeDescription}', '${result.subKey}', '${result.key}' );">
        <div class='insightdate'>${new Date(result.date).toLocaleString()}</div>
        <div class='insightname'>${safeName}</div>
        <div class='insightdescription'>${safeDescription}</div>
      </div>
    `;
  }).join('');
  console.log(results);
  return { html };
} else {
  let html = results.map((result, index) => {
    const safeCommentPre = result.comment.replace(/['"]/g, "");
    const safeComment = truncateString(stripHtmlTags(safeCommentPre), 100);
    const safeDescription = result.description.replace(/['"]/g, "");
    const safeName = result.name.replace(/['"]/g, "");
    return `
      <div style='cursor: pointer;' class='insightpos' data-index='${index}' id='insightpos${index}' onclick="handleClick(${index}, '${safeName}', '${safeCommentPre}', '${safeDescription}', '${result.subKey}', '${result.key}' );">
        <div class='insightdate'><b>${new Date(result.date).toLocaleString()}</b></div>
        <div class='insightdescription'>${safeComment}</div>
      </div>
    `;
  }).join('');
  console.log(results);
  return { html };

}


});



exports.surveyResponseInsightNew = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  try {
    const text = data.data.map(obj => `Q: ${obj.Q}\nA: ${obj.A}`).join('\n\n');
    const uidSave = data.uidSave;
    const uid = uidSave;
    const type = data.type;
    const source = data.source || "";
    console.log("type: " + type);
    console.log('uidSave: ' + uidSave);
    let prompt;
    switch (type) {
      case "InsightDiscovery":
        prompt = `Przeanalizuj wyniki testu Insight Discovery. Wyniki testu zawierają odpowiedzi na pytania z sześciu grup tematycznych: Decyzje, Komunikacja, Praca w zespole, Reakcja na stres, Motywacja i Rozwiązywanie problemów. Na podstawie tych odpowiedzi, określ cechy osoby wypełniającej test, wskazując dominujący kolor (Fiery Red, Sunshine Yellow, Earth Green, Cool Blue) wraz z uzasadnieniem. 

Dodatkowo, szczegółowo opisz, jak pozostałe kolory wpływają na osobowość tej osoby i w jaki sposób wzajemne oddziaływanie tych cech kształtuje jej całościowy profil. Uwzględnij, jak różne aspekty osobowości reprezentowane przez poszczególne kolory mogą się wzmacniać lub równoważyć.

Uwzględnij różnorodne aspekty osobowości, takie jak preferencje w podejmowaniu decyzji, sposób komunikacji, styl pracy w zespole, reakcje na stres, motywacje oraz podejście do rozwiązywania problemów. Udzielając odpowiedzi, opisz wyniki w sposób rozbudowany i szczegółowy, zawierając analizy wzajemnych wpływów różnych kolorów na osobowość osoby.

1. <b>Decyzje:</b> Oceń i opisz szczegółowo, czy osoba woli podejmować szybkie decyzje, unikać konfliktów, opierać się na analizach czy podejmować ryzyko. Skup się na aspektach takich jak impulsywność, potrzeba współpracy, dokładność oraz otwartość na innowacje.
2. <b>Komunikacja:</b> Zwróć uwagę, czy osoba jest bezpośrednia, uprzejma, logiczna, czy używa humoru w komunikacji. Rozważ preferencje związane z bezpośredniością, narracyjnością, uprzejmością i uporządkowaniem komunikacji.
3. <b>Praca w zespole:</b> Sprawdź i opisz szczegółowo, czy osoba lubi prowadzić zespół, pracować harmonijnie, koncentrować się na szczegółach czy pomagać innym. Oceniaj skłonności do przywództwa, współpracy, dbałości o szczegóły oraz wsparcia dla innych członków zespołu.
4. <b>Reakcja na stres:</b> Oceń i opisz szczegółowo, jak osoba reaguje na stres - szybko działa, motywuje innych, utrzymuje spokój czy analizuje sytuacje. Skup się na umiejętności szybkiego działania, motywowania innych, zachowania spokoju oraz analizy problemów.
5. <b>Motywacja:</b> Określ i opisz szczegółowo, co motywuje osobę - osiąganie celów, interakcje z ludźmi, docenianie, rozwiązywanie problemów czy praca nad długoterminowymi projektami. Rozważ motywacje związane z rywalizacją, interakcjami społecznymi, uznaniem, analitycznym podejściem i wytrwałością.
6. <b>Rozwiązywanie problemów:</b> Zwróć uwagę i opisz szczegółowo, czy osoba podchodzi do problemów bezpośrednio, angażuje innych, dąży do konsensusu, analizuje czy eksperymentuje z różnymi podejściami. Skup się na bezpośredniości, współpracy, konsensusie, analitycznym myśleniu oraz eksperymentowaniu.

Na podstawie analizy odpowiedzi, przypisz osobie dominujący kolor (Fiery Red, Sunshine Yellow, Earth Green, Cool Blue) i wyjaśnij szczegółowo, dlaczego ten kolor najlepiej odzwierciedla jej cechy. Dodatkowo, opisz wpływ pozostałych kolorów na jej osobowość i jak te wpływy wzajemnie się przenikają, tworząc całościowy obraz osoby. Uwzględnij wszystkie istotne informacje, aby dostarczyć pełny i złożony obraz osobowości osoby wypełniającej test. W podsumowaniu możesz wskazać ${(addprompt)}

W odpowiedzi nie używaj znaków **, zamiast tego odpowiednie fragmenty umieść w znacznikach <b>, a akapity w znacznikach <p>.

Pytania i odpowiedzi testu Insight Discovery:

`;

promptParam = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej badania Insight Discovery oraz wstępna analiza odpowiedzi. Q: to pytanie A: odpowiedź.

Przeanalizuj pytania i odpowiedzi oraz wstępną analizę i określ odpowiednie wskaźniki oceniające osobę badaną w skali od 1 do 10. Skala oceny wygląda następująco: 1 oznacza brak lub bardzo niskie nasilenie cech, 10 oznacza bardzo wysokie nasilenie cech.

Uwzględnij ocenę w następujących obszarach oraz dodaj rozbudowane wyjaśnienie dla każdego wskaźnika, opisując:

- Jak cechy związane z każdym kolorem wpływają na osobowość osoby.
- W jaki sposób te cechy współdziałają z cechami reprezentowanymi przez inne kolory.
- Jak wzajemne oddziaływanie tych cech kształtuje całościowy obraz osobowości osoby.

Przykład formatu odpowiedzi:

{
  "Wskazniki":{
    "Czerwony (Dominacja)": 8,
    "Żółty (Wpływ)": 7,
    "Zielony (Stabilizacja)": 9,
    "Niebieski (Analiza)": 6
  },
  "Wyjasnienia":{
    "Czerwony (Dominacja)": "Rozbudowane wyjaśnienie wskaźnika, uwzględniające wpływ cech związanych z dominacją na osobowość osoby oraz jak te cechy współdziałają z innymi aspektami (kolorami) jej osobowości.",
    "Żółty (Wpływ)": "Rozbudowane wyjaśnienie wskaźnika, uwzględniające wpływ cech związanych z wpływem na osobowość osoby oraz jak te cechy współdziałają z innymi aspektami (kolorami) jej osobowości.",
    "Zielony (Stabilizacja)": "Rozbudowane wyjaśnienie wskaźnika, uwzględniające wpływ cech związanych ze stabilizacją na osobowość osoby oraz jak te cechy współdziałają z innymi aspektami (kolorami) jej osobowości.",
    "Niebieski (Analiza)": "Rozbudowane wyjaśnienie wskaźnika, uwzględniające wpływ cech związanych z analizą na osobowość osoby oraz jak te cechy współdziałają z innymi aspektami (kolorami) jej osobowości."
  }
}

<b>Definicja skali dla każdego wskaźnika:</b>

<b>Czerwony (Dominacja):</b>
1: Brak dominujących cech, brak skłonności do podejmowania szybkich decyzji i unikania konfliktów.
10: Bardzo wysoka dominacja, skłonność do podejmowania szybkich decyzji, unikania konfliktów, podejmowania ryzyka.

<b>Żółty (Wpływ):</b>
1: Brak cech związanych z wpływem, brak skłonności do bycia bezpośrednim, używania humoru w komunikacji.
10: Bardzo wysoki wpływ, skłonność do bycia bezpośrednim, używania humoru, narracyjności w komunikacji.

<b>Zielony (Stabilizacja):</b>
1: Brak cech stabilizacji, brak skłonności do pracy harmonijnej, koncentrowania się na szczegółach, wspierania innych.
10: Bardzo wysoka stabilizacja, skłonność do pracy harmonijnej, koncentrowania się na szczegółach, wspierania innych.

<b>Niebieski (Analiza):</b>
1: Brak cech analizy, brak skłonności do dokładności, analitycznego podejścia do rozwiązywania problemów.
10: Bardzo wysoka analiza, skłonność do dokładności, analitycznego podejścia do rozwiązywania problemów.

Odpowiedź przygotuj w formacie JSON.

Pytania i odpowiedzi osoby badanej:

`;
        break;
      case "ADHDFullTest":
        prompt = `Przeanalizuj wyniki testu DIVA-5. Wyniki testu zawierają odpowiedzi na pytania dotyczące wieku dorosłego oraz dzieciństwa. Na podstawie tych odpowiedzi, określ cechy osoby wypełniającej test, wskazując na możliwość występowania ADHD. Uwzględnij różnorodne aspekty, takie jak nieuwaga, impulsywność oraz hiperaktywność, zarówno w kontekście dorosłości, jak i dzieciństwa.

Na podstawie analizy odpowiedzi, określ, czy osoba wypełniająca test może wskazywać na obecność ADHD. Udzielając odpowiedzi, opisz wyniki w sposób rozbudowany i szczegółowy, uwzględniając wszystkie istotne informacje, aby dostarczyć pełny obraz funkcjonowania osoby w różnych aspektach życia. Przedstaw również krótko, jak osoba odpowiadająca powinna przygotować się do badania psychologicznego w formie wywiadu DIVA-5 i jak to badanie najczęściej wygląda. W odpowiedzi nie używaj znaków **, zamiast tego odpowiednie fragmenty umieść w znacznikach <b> a akapity w znacznikach <p>. W podsumowaniu możesz wskazać ${(addprompt)}

1. <b>Nieuwaga:</b> Oceń, czy osoba ma trudności z koncentracją na zadaniach, łatwo się rozprasza, zapomina o codziennych obowiązkach, unika zadań wymagających długotrwałego wysiłku umysłowego. Skup się na aspektach takich jak brak uwagi na szczegóły, trudności w organizacji zadań oraz częste gubienie przedmiotów.
2. <b>Impulsywność:</b> Zwróć uwagę, czy osoba podejmuje szybkie decyzje bez zastanowienia, ma trudności z czekaniem na swoją kolej, przerywa innym w rozmowach, działa impulsywnie bez myślenia o konsekwencjach. Rozważ preferencje związane z impulsywnym działaniem, przerywaniem oraz niecierpliwością.
3. <b>Hiperaktywność:</b> Sprawdź, czy osoba jest nadmiernie aktywna, ma trudności z pozostaniem w jednym miejscu, często się wierci, biega lub wspina się w sytuacjach, gdzie jest to niewłaściwe. Oceniaj skłonności do nadmiernej aktywności fizycznej oraz wewnętrznego poczucia niepokoju.
4. <b>Funkcjonowanie w dzieciństwie:</b> Oceń, jak te same cechy objawiały się w dzieciństwie. Zwróć uwagę na trudności szkolne, problemy z relacjami rówieśniczymi, konflikty z nauczycielami i rodzicami oraz wszelkie inne problemy, które mogą być związane z ADHD.
5. <b>Funkcjonowanie w dorosłości:</b> Skup się na tym, jak ADHD wpływa na życie zawodowe, relacje interpersonalne, zdolność do zarządzania czasem i organizacji oraz ogólne funkcjonowanie osoby dorosłej. Oceń, czy te objawy są obecne i wpływają na codzienne życie. 
Pytania i odpowiedzi osoby badanej dla wieku dorosłego:

`;

        promptParam = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedz. Przeanalizuj pytania i odpowiedzi oraz wstępną analizę i określ odpowiednie wskaźniki oceniające ADHD osoby badanej w skali od 1 do 10. Skala oceny wygląda następująco: 1 oznacza brak lub bardzo niskie nasilenie objawów, 10 oznacza bardzo wysokie nasilenie objawów. Uwzględnij ocenę w następujących obszarach oraz dodaj krótkie wyjaśnienie dla każdego wskaźnika:\n\n{\n  \"Wskazniki\":{\n  \"Impulsywność\": 8,\n  \"Nieuważność\": 7,\n  \"Hiperaktywność\": 9,\n  \"Trudności z organizacją zadań\": 6,\n  \"Trudności z relacjami społecznymi\": 5\n},\n\"Wyjasnienia\":{\n  \"Impulsywność\": \"Wyjaśnienie wskaźnika\",\n  \"Nieuważność\": \"Wyjaśnienie wskaźnika\",\n  \"Hiperaktywność\": \"Wyjaśnienie wskaźnika\",\n  \"Trudności z organizacją zadań\": \"Wyjaśnienie wskaźnika\",\n  \"Trudności z relacjami społecznymi\": \"Wyjaśnienie wskaźnika\"\n}}\n  \n\n<b>Definicja skali dla każdego wskaźnika:</b>\n\n<b>Impulsywność:</b>\n1: Brak lub bardzo niskie nasilenie działań impulsywnych, brak przerywania innym w rozmowach, brak zmiany tematów rozmów.\n10: Ekstremalnie wysokie nasilenie działań impulsywnych, bardzo częste przerywanie innym, ciągłe zmiany tematów rozmów.\n\n<b>Nieuważność:</b>\n1: Brak problemów z utrzymaniem uwagi, brak łatwego rozpraszania się, brak trudności z koncentracją.\n10: Bardzo wysokie nasilenie problemów z utrzymaniem uwagi, bardzo łatwe rozpraszanie się, bardzo duże trudności z koncentracją.\n\n<b>Hiperaktywność:</b>\n1: Brak nadmiernej aktywności fizycznej, brak potrzeby ciągłego ruchu.\n10: Ekstremalnie wysoka nadmierna aktywność fizyczna, ciągła potrzeba ruchu.\n\n<b>Trudności z organizacją zadań:</b>\n1: Brak trudności z organizacją czasu i zadań, brak problemów z planowaniem i realizacją zadań.\n10: Bardzo wysokie trudności z organizacją czasu i zadań, bardzo duże problemy z planowaniem i realizacją zadań.\n\n<b>Trudności z relacjami społecznymi:</b>\n1: Brak trudności w interakcjach społecznych, brak problemów w nawiązywaniu i utrzymywaniu relacji.\n10: Bardzo wysokie trudności w interakcjach społecznych, bardzo duże problemy w nawiązywaniu i utrzymywaniu relacji. Odpowiedz przygotuj w json.
  Pytania i odpowiedzi osoby badanej dla wieku dorosłego:
`;


        break;
      case "ADHDSelfCheck":
        prompt = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedz. Przeanalizuj podane pytania i odpowiedzi w kontekście możliwości występowania ADHD. Test jest typu self-check. Opisz i w sposób rozbudowany podsumuj wynik testu oddzielnie dla każdego z poniższych obszarów:

<b>Impulsywność:</b><p>Oceń działania impulsywne, przerywanie innym w trakcie rozmów oraz zmiany tematu rozmów bez trzymania się głównego wątku.</p>
<b>Nieuważność:</b><p>Oceń problemy z utrzymaniem uwagi, łatwe rozpraszanie się oraz trudności z koncentracją podczas wykonywania zadań.</p>
<b>Hiperaktywność:</b><p>Oceń nadmierną aktywność fizyczną oraz potrzebę ciągłego ruchu.</p>
<b>Trudności z organizacją zadań:</b><p>Oceń trudności z organizacją czasu i zadań oraz problemy z planowaniem i realizacją zadań.</p>
<b>Trudności z relacjami społecznymi:</b><p>Oceń problemy w interakcjach społecznych, w tym trudności w nawiązywaniu i utrzymywaniu relacji.</p>

Podsumuj w sposób rozbudowany i określ, czy na podstawie tych pytań można wskazać, że osoba wypełniająca test może wskazywać na obecność ADHD. W podsumowaniu możesz wskazać ${(addprompt)} W odpowiedzi nie używaj znaków **, zamiast tego odpowiednie fragmenty umieść w znacznikach <b> a akapity w znacznikach <p>. Pytania i odpowiedzi osoby badanej dla wieku dorosłego:
`;
        promptParam = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedz. Przeanalizuj pytania i odpowiedzi oraz wstępną analizę i określ odpowiednie wskaźniki oceniające ADHD osoby badanej w skali od 1 do 10. Skala oceny wygląda następująco: 1 oznacza brak lub bardzo niskie nasilenie objawów, 10 oznacza bardzo wysokie nasilenie objawów. Uwzględnij ocenę w następujących obszarach oraz dodaj krótkie wyjaśnienie dla każdego wskaźnika:\n\n{\n  \"Wskazniki\":{\n  \"Impulsywność\": 8,\n  \"Nieuważność\": 7,\n  \"Hiperaktywność\": 9,\n  \"Trudności z organizacją zadań\": 6,\n  \"Trudności z relacjami społecznymi\": 5\n},\n\"Wyjasnienia\":{\n  \"Impulsywność\": \"Wyjaśnienie wskaźnika\",\n  \"Nieuważność\": \"Wyjaśnienie wskaźnika\",\n  \"Hiperaktywność\": \"Wyjaśnienie wskaźnika\",\n  \"Trudności z organizacją zadań\": \"Wyjaśnienie wskaźnika\",\n  \"Trudności z relacjami społecznymi\": \"Wyjaśnienie wskaźnika\"\n}}\n  \n\n<b>Definicja skali dla każdego wskaźnika:</b>\n\n<b>Impulsywność:</b>\n1: Brak lub bardzo niskie nasilenie działań impulsywnych, brak przerywania innym w rozmowach, brak zmiany tematów rozmów.\n10: Ekstremalnie wysokie nasilenie działań impulsywnych, bardzo częste przerywanie innym, ciągłe zmiany tematów rozmów.\n\n<b>Nieuważność:</b>\n1: Brak problemów z utrzymaniem uwagi, brak łatwego rozpraszania się, brak trudności z koncentracją.\n10: Bardzo wysokie nasilenie problemów z utrzymaniem uwagi, bardzo łatwe rozpraszanie się, bardzo duże trudności z koncentracją.\n\n<b>Hiperaktywność:</b>\n1: Brak nadmiernej aktywności fizycznej, brak potrzeby ciągłego ruchu.\n10: Ekstremalnie wysoka nadmierna aktywność fizyczna, ciągła potrzeba ruchu.\n\n<b>Trudności z organizacją zadań:</b>\n1: Brak trudności z organizacją czasu i zadań, brak problemów z planowaniem i realizacją zadań.\n10: Bardzo wysokie trudności z organizacją czasu i zadań, bardzo duże problemy z planowaniem i realizacją zadań.\n\n<b>Trudności z relacjami społecznymi:</b>\n1: Brak trudności w interakcjach społecznych, brak problemów w nawiązywaniu i utrzymywaniu relacji.\n10: Bardzo wysokie trudności w interakcjach społecznych, bardzo duże problemy w nawiązywaniu i utrzymywaniu relacji. Odpowiedz przygotuj w json.
  Pytania i odpowiedzi osoby badanej dla wieku dorosłego:
`;
        break;
      case "SASelfCheck":
        prompt = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedz. Przeanalizuj podane pytania i odpowiedzi w kontekście możliwości występowania zespołu Aspergera. Test jest typu self-check. Opisz i w sposób rozbudowany podsumuj wynik testu oddzielnie dla każdego z poniższych obszarów:

<b>Komunikacja i Interakcje Społeczne:</b><p>Oceń trudności w rozpoznawaniu emocji innych osób, unikanie kontaktu wzrokowego, tendencję do omawiania swoich zainteresowań bez uwzględniania zainteresowania rozmówcy, oraz trudności w nawiązywaniu i utrzymywaniu relacji z rówieśnikami. Uwzględnij również opisowe sytuacje dotyczące trudności w komunikacji i interakcjach społecznych.</p>
<b>Zainteresowania i Zachowania:</b><p>Oceń ograniczone, ale intensywne zainteresowania, nietypowe reakcje na bodźce sensoryczne, tendencję do powtarzania tych samych ruchów lub zachowań, oraz trudności z adaptacją do zmian w codziennej rutynie. Uwzględnij również opisowe informacje na temat zainteresowań oraz strategii radzenia sobie z trudnościami związanymi z adaptacją do zmian.</p>
<b>Emocje i Samopoczucie:</b><p>Oceń częstość odczuwania niepokoju lub lęku, trudności z identyfikacją i wyrażaniem własnych emocji, oraz nieproporcjonalne reakcje emocjonalne do sytuacji. Uwzględnij również opisowe strategie radzenia sobie z trudnościami w zakresie emocji i samopoczucia.</p>
<b>Refleksja i Ocena:</b><p>Oceń refleksje na temat własnych doświadczeń związanych z zespołem Aspergera oraz motywacje i oczekiwania związane z przeprowadzeniem testu.</p>

Podsumuj w sposób rozbudowany i określ, czy na podstawie tych pytań można wskazać, że osoba wypełniająca test może wskazywać na obecność zespołu Aspergera. W podsumowaniu możesz wskazać ${(addprompt)} W odpowiedzi nie używaj znaków **, zamiast tego odpowiednie fragmenty umieść w znacznikach <b> a akapity w znacznikach <p>. Pytania i odpowiedzi osoby badanej dla wieku dorosłego:
 `;
        promptParam = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedz. Przeanalizuj pytania i odpowiedzi oraz wstępną analizę i określ odpowiednie wskaźniki oceniające zespół Aspergera osoby badanej w skali od 1 do 10. Skala oceny wygląda następująco: 1 oznacza brak lub bardzo niskie nasilenie objawów, 10 oznacza bardzo wysokie nasilenie objawów. Uwzględnij ocenę w następujących obszarach oraz dodaj krótkie wyjaśnienie dla każdego wskaźnika. Odpowiedz przygotuj w json:
        {
  "Wskazniki": {
    "Interakcje Społeczne": 8,
    "Zainteresowania": 7,
    "Emocje": 9,
    "Refleksja i Ocena": 6,
    "Trudności z relacjami społecznymi": 5
  },
  "Wyjasnienia": {
    "Interakcje Społeczne": "Wyjasnienie wskaźnika",
    "Zainteresowania": "Wyjasnienie wskaźnika",
    "Emocje": "Wyjasnienie wskaźnika",
    "Refleksja i Ocena": "Wyjasnienie wskaźnika",
    "Trudności z relacjami społecznymi": "Wyjasnienie wskaźnika"
  }
}
        
        \n\n<b>Definicja skali dla każdego wskaźnika:</b>\n\n<b>Interakcje Społeczne:</b>\n1: Brak trudności w rozpoznawaniu emocji innych osób, kontakt wzrokowy, uwzględnianie zainteresowania rozmówcy, brak trudności w nawiązywaniu relacji.\n10: Ekstremalne trudności w rozpoznawaniu emocji innych osób, unikanie kontaktu wzrokowego, omawianie zainteresowań bez uwzględniania rozmówcy, duże trudności w nawiązywaniu relacji.\n\n<b>Zainteresowania:</b>\n1: Brak ograniczonych i intensywnych zainteresowań, brak nietypowych reakcji na bodźce sensoryczne, brak powtarzalnych ruchów lub zachowań, łatwość adaptacji do zmian.\n10: Ekstremalnie ograniczone i intensywne zainteresowania, bardzo nietypowe reakcje na bodźce sensoryczne, powtarzalne ruchy lub zachowania, bardzo duże trudności w adaptacji do zmian.\n\n<b>Emocje:</b>\n1: Brak lub bardzo niskie poziomy niepokoju lub lęku, łatwość identyfikacji i wyrażania emocji, proporcjonalne reakcje emocjonalne.\n10: Bardzo wysokie poziomy niepokoju lub lęku, duże trudności w identyfikacji i wyrażaniu emocji, nieproporcjonalne reakcje emocjonalne.\n\n<b>Refleksja i Ocena:</b>\n1: Brak zastanawiania się nad związkiem doświadczeń z zespołem Aspergera, jasne motywacje i oczekiwania związane z testem.\n10: Bardzo dużo refleksji nad związkiem doświadczeń z zespołem Aspergera, skomplikowane motywacje i wysokie oczekiwania związane z testem.\n\n<b>Trudności z relacjami społecznymi:</b>\n1: Brak trudności w nawiązywaniu i utrzymywaniu relacji społecznych.\n10: Bardzo duże trudności w nawiązywaniu i utrzymywaniu relacji społecznych. Pytania i odpowiedzi osoby badanej dla wieku dorosłego:`;

        break;
      case "TestStres":
        prompt = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedź. Przeanalizuj podane pytania i odpowiedzi w kontekście oceny poziomu stresu. Test jest typu self-check. Opisz i w sposób rozbudowany podsumuj wynik testu oddzielnie dla każdego z poniższych obszarów:

<b>Źródła Stresu:</b><p>Oceń, jak często i z jakich powodów osoba odczuwa stres. Skup się na stresie związanym z nadmiarem obowiązków w pracy, konfliktami w relacjach osobistych, obawami o zdrowie, niepewnością finansową oraz natłokiem informacji i byciem „online”.</p>
<b>Objawy Stresu:</b><p>Oceń fizyczne i emocjonalne objawy stresu, takie jak bóle głowy, problemy z trawieniem, uczucie smutku lub lęku, trudności z koncentracją oraz wpływ stresu na jakość snu.</p>
<b>Niekuteczność Radzenia sobie ze Stresem:</b><p>Oceń, jak osoba radzi sobie ze stresem. Skup się na stosowaniu technik relaksacyjnych, aktywności fizycznej, rozmowach z bliskimi lub terapii, a także innych strategiach radzenia sobie ze stresem, które osoba mogła opisać.</p>

Szczegółowo podsumuj oraz określ, czy na podstawie tych pytań można wskazać, że osoba doświadcza wysokiego poziomu stresu i czy stosowane przez nią strategie są skuteczne. W podsumowaniu możesz wskazać ${(addprompt)} W odpowiedzi nie używaj znaków **, zamiast tego odpowiednie fragmenty umieść w znacznikach <b> a akapity w znacznikach <p>. Pytania i odpowiedzi osoby badanej dla wieku dorosłego:
`;

promptParam = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej dotyczące stresu oraz wstępna analiza odpowiedzi. Q: to pytanie A: odpowiedź. Przeanalizuj pytania i odpowiedzi oraz wstępną analizę i określ odpowiednie wskaźniki oceniające poziom stresu osoby badanej w skali od 1 do 10. Skala oceny wygląda następująco: 1 oznacza brak lub bardzo niski poziom stresu, 10 oznacza bardzo wysoki poziom stresu. Uwzględnij ocenę w następujących obszarach oraz dodaj krótkie wyjaśnienie dla każdego wskaźnika. Odpowiedź przygotuj w formacie JSON:

{
  \"Wskazniki\": {
    \"Nasilenie Stresu\": 8,
    \"Fizyczne Objawy Stresu\": 7,
    \"Nieskuteczność Radzenia Sobie\": 5
  },
  \"Wyjasnienia\": {
    \"Nasilenie Stresu\": \"Osoba często odczuwa stres związany z nadmiarem obowiązków, konfliktami i niepewnością finansową.\",
    \"Fizyczne Objawy Stresu\": \"Osoba doświadcza fizycznych objawów stresu, takich jak bóle głowy, trudności z koncentracją oraz problemy ze snem.\",
    \"Nieskuteczność Radzenia Sobie\": \"Osoba stosuje niektóre techniki relaksacyjne, ale ma trudności z regularnym stosowaniem skutecznych strategii.\"
  }
}

\n\n<b>Definicja skali dla każdego wskaźnika:</b>\n\n<b>Nasilenie Stresu:</b>\n1: Brak odczuwania stresu lub bardzo niski poziom stresu.\n10: Bardzo intensywne i częste odczuwanie stresu związane z wieloma źródłami.\n\n<b>Fizyczne Objawy Stresu:</b>\n1: Brak fizycznych objawów stresu.\n10: Bardzo intensywne i częste fizyczne objawy związane ze stresem, takie jak bóle głowy, problemy z trawieniem itp.\n\n<b>Nieskuteczność Radzenia Sobie:</b>\n1: Bardzo skuteczne i regularnie stosowane strategie radzenia sobie ze stresem.\n10: Brak skutecznych strategii radzenia sobie ze stresem lub ich bardzo niska efektywność. Pytania i odpowiedzi osoby badanej dla wieku dorosłego:`;
        break;
      case "EmpatyTest":
        prompt = `
        Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedź. Przeanalizuj podane pytania i odpowiedzi w kontekście oceny poziomu empatii. Test jest typu self-check. Opisz i w sposób rozbudowany podsumuj wynik testu oddzielnie dla każdego z poniższych obszarów:

<b>Zrozumienie Emocji:</b><p>Oceń umiejętność osoby w identyfikacji i rozumieniu emocji innych osób, analizowaniu tych emocji oraz odczuwaniu emocji innych na podstawie ich reakcji i opowieści.</p>
<b>Reakcje na Emocje Innych:</b><p>Oceń, jak osoba reaguje na emocje innych, w tym elastyczność w dostosowywaniu swojego zachowania, skłonność do pocieszania, oferowania pomocy oraz gotowość do poświęceń na rzecz innych.</p>
<b>Wczuwanie się w Innych:</b><p>Oceń zdolność osoby do wcielania się w sytuację innych, refleksję nad emocjami innych oraz świadomość wpływu własnych działań na innych.</p>
<b>Refleksja i Ocena:</b><p>Oceń, jak osoba reflektuje nad własnym poziomem empatii, czy podejmuje działania na rzecz innych kosztem własnych potrzeb oraz jak empatia wpływa na budowanie pozytywnych relacji.</p>

Szczegółowo podsumuj oraz określ, czy na podstawie tych pytań można wskazać, że osoba posiada wysoki poziom empatii. W podsumowaniu możesz wskazać ${(addprompt)} W odpowiedzi nie używaj znaków **, zamiast tego odpowiednie fragmenty umieść w znacznikach <b>, a akapity w znacznikach <p>. Pytania i odpowiedzi osoby badanej dla wieku dorosłego:
        `;

        promptParam = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej dotyczące empatii oraz wstępna analiza odpowiedzi. Q: to pytanie A: odpowiedź. Przeanalizuj pytania i odpowiedzi oraz wstępną analizę i określ odpowiednie wskaźniki oceniające poziom empatii osoby badanej w skali od 1 do 10. Skala oceny wygląda następująco: 1 oznacza brak lub bardzo niski poziom empatii, 10 oznacza bardzo wysoki poziom empatii. Uwzględnij ocenę w następujących obszarach oraz dodaj krótkie wyjaśnienie dla każdego wskaźnika. Odpowiedź przygotuj w formacie JSON:

{
  \"Wskazniki\": {
    \"Zrozumienie Emocji\": 8,
    \"Reakcje na Emocje Innych\": 7,
    \"Wczuwanie się w Innych\": 9,
    \"Refleksja i Ocena\": 6
  },
  \"Wyjasnienia\": {
    \"Zrozumienie Emocji\": \"Osoba często potrafi zidentyfikować emocje innych na podstawie ich wyrazu twarzy i analizuje ich przyczyny.\",
    \"Reakcje na Emocje Innych\": \"Osoba często dostosowuje swoje zachowanie do emocji innych, choć czasami zdarza się, że nie zawsze to robi.\",
    \"Wczuwanie się w Innych\": \"Osoba wykazuje wysoką zdolność do wcielania się w sytuację innych i unikania zadawania im bólu.\",
    \"Refleksja i Ocena\": \"Osoba czasami reflektuje nad swoim poziomem empatii, ale nie zawsze poświęca swoje potrzeby na rzecz innych.\"
  }
}

\n\n<b>Definicja skali dla każdego wskaźnika:</b>\n\n<b>Zrozumienie Emocji:</b>\n1: Brak umiejętności rozpoznawania i zrozumienia emocji innych.\n10: Bardzo wysoka umiejętność rozpoznawania i zrozumienia emocji innych.\n\n<b>Reakcje na Emocje Innych:</b>\n1: Brak reakcji na emocje innych, brak skłonności do pomagania lub pocieszania.\n10: Bardzo wysoka elastyczność w reagowaniu na emocje innych, częste pocieszanie i pomaganie.\n\n<b>Wczuwanie się w Innych:</b>\n1: Brak zdolności do wczuwania się w sytuację innych i brak refleksji nad emocjami innych.\n10: Bardzo wysoka zdolność do wczuwania się w sytuację innych i refleksji nad ich emocjami.\n\n<b>Refleksja i Ocena:</b>\n1: Brak refleksji nad własnym poziomem empatii, brak skłonności do poświęceń na rzecz innych.\n10: Bardzo wysoka refleksja nad własnym poziomem empatii, częste poświęcanie się na rzecz innych. Pytania i odpowiedzi osoby badanej dla wieku dorosłego: `;

        break;
      case "youInWork":
        prompt = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedź. Przeanalizuj podane pytania i odpowiedzi w kontekście oceny preferencji zawodowych osoby z ADHD. Test jest typu self-check. Opisz i w sposób rozbudowany podsumuj wynik testu oddzielnie dla każdego z poniższych obszarów:

<b>Zainteresowania i Umiejętności:</b><p>Oceń, jakie obszary zainteresowań są najbardziej fascynujące dla osoby badanej oraz w jakich dziedzinach uważa, że ma największe umiejętności. Uwzględnij także, które umiejętności lub zainteresowania chciałaby rozwijać w przyszłości.</p>
<b>Styl Pracy:</b><p>Oceń preferencje dotyczące stylu pracy, środowiska pracy oraz godzin pracy. Skup się na tym, czy osoba preferuje pracę samodzielną czy zespołową, jakie środowisko pracy jest dla niej najbardziej komfortowe oraz jakie są jej preferencje dotyczące elastyczności godzin pracy.</p>
<b>Preferencje Zawodowe:</b><p>Oceń preferencje zawodowe osoby badanej, takie jak chęć częstych podróży służbowych, preferencje dotyczące pracy kreatywnej versus zdefiniowanej, kontakt z ludźmi versus samodzielność oraz wykorzystanie umiejętności manualnych.</p>
<b>Ogólne Pytania Otwarte:</b><p>Oceń odpowiedzi na otwarte pytania dotyczące mocnych stron, przyszłych ścieżek kariery, zainteresowań branżowych oraz doświadczeń zawodowych. Uwzględnij także, jakie czynniki osoba uważa za stresujące lub demotywujące w pracy i jakie strategie stosuje, aby sobie z nimi radzić.</p>

Szczegółowo podsumuj oraz określ, czy na podstawie tych pytań można wskazać, jakie ścieżki kariery mogą być najbardziej odpowiednie dla osoby z ADHD oraz jakie cechy środowiska pracy są dla niej najkorzystniejsze. W podsumowaniu możesz wskazać ${(addprompt)} W odpowiedzi nie używaj znaków **, zamiast tego odpowiednie fragmenty umieść w znacznikach <b>, a akapity w znacznikach <p>. Pytania i odpowiedzi osoby badanej dla wieku dorosłego:
`;

promptParam = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej dotyczące preferencji zawodowych oraz wstępna analiza odpowiedzi. Q: to pytanie A: odpowiedź. Przeanalizuj pytania i odpowiedzi oraz wstępną analizę i określ odpowiednie wskaźniki oceniające preferencje zawodowe osoby z ADHD w skali od 1 do 10. Skala oceny wygląda następująco: 1 oznacza brak lub bardzo niskie nasilenie preferencji, 10 oznacza bardzo wysokie nasilenie preferencji. Uwzględnij ocenę w następujących obszarach oraz dodaj krótkie wyjaśnienie dla każdego wskaźnika. Odpowiedź przygotuj w formacie JSON:

{
  \"Wskazniki\": {
    \"Zainteresowania i Umiejętności\": 8,
    \"Styl Pracy\": 7,
    \"Preferencje Zawodowe\": 9,
    \"Ogólne Pytania Otwarte\": 6
  },
  \"Wyjasnienia\": {
    \"Zainteresowania i Umiejętności\": \"Osoba wykazuje silne zainteresowania w obszarze technologii oraz posiada umiejętności analityczne i kreatywne, które chce rozwijać w przyszłości.\",
    \"Styl Pracy\": \"Osoba preferuje samodzielną pracę, najlepiej w elastycznym środowisku pracy, z możliwością pracy zdalnej.\",
    \"Preferencje Zawodowe\": \"Osoba wyraźnie preferuje pracę z kreatywnymi zadaniami oraz taką, która umożliwia samodzielność, ale także częste interakcje z innymi.\",
    \"Ogólne Pytania Otwarte\": \"Osoba podkreśla swoje mocne strony, takie jak komunikatywność i liderstwo, oraz wyraża zainteresowanie pracą w branżach związanych z mediami i komunikacją.\"
  }
}

\n\n<b>Definicja skali dla każdego wskaźnika:</b>\n\n<b>Zainteresowania i Umiejętności:</b>\n1: Brak jasno zdefiniowanych zainteresowań lub umiejętności.\n10: Bardzo silne zainteresowania i umiejętności w określonych dziedzinach.\n\n<b>Styl Pracy:</b>\n1: Brak wyraźnych preferencji dotyczących stylu pracy i środowiska pracy.\n10: Bardzo wyraźne preferencje dotyczące stylu pracy i środowiska pracy, z jasno określonymi preferencjami dotyczącymi miejsca i godzin pracy.\n\n<b>Preferencje Zawodowe:</b>\n1: Brak wyraźnych preferencji dotyczących rodzaju pracy.\n10: Bardzo wyraźne preferencje dotyczące rodzaju pracy, ze szczególnym uwzględnieniem kontaktów z ludźmi, samodzielności, podróży służbowych itp.\n\n<b>Ogólne Pytania Otwarte:</b>\n1: Brak jasnych odpowiedzi na pytania otwarte, brak jasno określonych mocnych stron i zainteresowań zawodowych.\n10: Bardzo jasne odpowiedzi na pytania otwarte, z wyraźnym określeniem mocnych stron i zainteresowań zawodowych. Pytania i odpowiedzi osoby badanej dla wieku dorosłego: 
`;
        break;
      case "TestTimeManagement":
        prompt = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedź. Przeanalizuj podane pytania i odpowiedzi w kontekście oceny umiejętności zarządzania czasem. Test jest typu self-check. Opisz i w sposób rozbudowany podsumuj wynik testu oddzielnie dla każdego z poniższych obszarów:

<b>Planowanie i Organizacja:</b>
<p>Oceń, jak często osoba planuje swój dzień z wyprzedzeniem, używa narzędzi do zarządzania czasem, ustala priorytety oraz jak radzi sobie z delegowaniem zadań i korektą planów w obliczu przeszkód.</p>
<b>Prokrastynacja i Rozpraszacze:</b>
<p>Oceń, jak często osoba odkłada zadania na później, jak radzi sobie z rozpraszaczami oraz czy regularnie robi przerwy, aby utrzymać produktywność.</p>
<b>Stres i Multitasking:</b>
<p>Oceń, jak dobrze osoba radzi sobie z multitaskingiem, stresem związanym z nadmiarem zadań oraz czy znajduje czas na relaks i odpoczynek.</p>
<b>Analiza i Ocena:</b>
<p>Oceń, jak dobrze osoba ustala cele i terminy dla swoich zadań, czy regularnie analizuje swoje wyniki, jak reflektuje nad swoim sposobem zarządzania czasem oraz jak ocenia potrzebę poprawy swoich umiejętności.</p>

Szczegółowo podsumuj oraz określ, czy na podstawie tych pytań można wskazać, jakie są mocne strony i obszary do poprawy w zarządzaniu czasem osoby badanej. W podsumowaniu możesz wskazać ${(addprompt)} W odpowiedzi nie używaj znaków **, zamiast tego odpowiednie fragmenty umieść w znacznikach <b>, a akapity w znacznikach <p>. Pytania i odpowiedzi osoby badanej dla wieku dorosłego:
`;

promptParam =`Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej dotyczące zarządzania czasem oraz wstępna analiza odpowiedzi. Q: to pytanie A: odpowiedź. Przeanalizuj pytania i odpowiedzi oraz wstępną analizę i określ odpowiednie wskaźniki oceniające umiejętności zarządzania czasem osoby badanej w skali od 1 do 10. Skala oceny wygląda następująco: 1 oznacza brak lub bardzo niski poziom umiejętności zarządzania czasem, 10 oznacza bardzo wysoki poziom umiejętności. Uwzględnij ocenę w następujących obszarach oraz dodaj krótkie wyjaśnienie dla każdego wskaźnika. Odpowiedź przygotuj w formacie JSON:

{
  \"Wskazniki\": {
    \"Planowanie i Organizacja\": 8,
    \"Prokrastynacja i Rozpraszacze\": 6,
    \"Stres i Multitasking\": 7,
    \"Analiza i Ocena\": 5
  },
  \"Wyjasnienia\": {
    \"Planowanie i Organizacja\": \"Osoba regularnie planuje swój dzień i ustala priorytety, korzysta z narzędzi do zarządzania czasem, ale czasami ma trudności z delegowaniem zadań.\",
    \"Prokrastynacja i Rozpraszacze\": \"Osoba czasami odkłada zadania na później i ma umiarkowane trudności z radzeniem sobie z rozpraszaczami.\",
    \"Stres i Multitasking\": \"Osoba dobrze radzi sobie z multitaskingiem i stresem, ale nie zawsze znajduje czas na relaks.\",
    \"Analiza i Ocena\": \"Osoba czasami analizuje swoje wyniki i reflektuje nad zarządzaniem czasem, ale widzi potrzebę poprawy tych umiejętności.\"
  }
}

\n\n<b>Definicja skali dla każdego wskaźnika:</b>\n\n<b>Planowanie i Organizacja:</b>\n1: Brak umiejętności planowania i organizacji, brak ustalania priorytetów i korekty planów.\n10: Bardzo wysoki poziom planowania i organizacji, regularne ustalanie priorytetów, korzystanie z narzędzi i korekta planów w obliczu przeszkód.\n\n<b>Prokrastynacja i Rozpraszacze:</b>\n1: Bardzo wysoka skłonność do odkładania zadań i ulegania rozpraszaczom, brak przerw podczas pracy.\n10: Bardzo niska skłonność do prokrastynacji, doskonałe radzenie sobie z rozpraszaczami i regularne przerwy dla utrzymania produktywności.\n\n<b>Stres i Multitasking:</b>\n1: Brak umiejętności radzenia sobie ze stresem i multitaskingiem, brak czasu na relaks.\n10: Bardzo wysoki poziom radzenia sobie ze stresem, doskonała umiejętność multitaskingu i regularne znajdowanie czasu na relaks.\n\n<b>Analiza i Ocena:</b>\n1: Brak refleksji nad własnym zarządzaniem czasem, brak ustalania celów i terminów oraz analizy wyników.\n10: Bardzo wysoki poziom refleksji nad zarządzaniem czasem, regularne ustalanie celów i terminów oraz analiza wyników. Pytania i odpowiedzi osoby badanej dla wieku dorosłego: `;

        break;
      case "testCreativity":
        prompt = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedź. Przeanalizuj podane pytania i odpowiedzi w kontekście oceny poziomu kreatywności. Test jest typu self-check. Opisz i w sposób rozbudowany podsumuj wynik testu oddzielnie dla każdego z poniższych obszarów:

<b>Generowanie Pomysłów:</b>
<p>Oceń, jak często osoba znajduje nowe sposoby rozwiązania codziennych problemów, generuje różnorodne pomysły na jeden temat, znajduje inspirację w nieoczywistych miejscach oraz jak dobrze przystosowuje swoje pomysły do zmieniających się okoliczności. Uwzględnij także gotowość do eksperymentowania z nowymi metodami pracy.</p>
<b>Kreatywne Rozwiązywanie Problemów:</b>
<p>Oceń, jak często osoba kwestionuje tradycyjne sposoby myślenia, znajduje nieszablonowe rozwiązania, angażuje się w projekty wymagające twórczego myślenia oraz jak dobrze radzi sobie z rozwiązywaniem problemów pod presją czasu. Uwzględnij także gotowość do poszukiwania nowych doświadczeń dla rozwoju kreatywności.</p>
<b>Współpraca i Działanie:</b>
<p>Oceń, jak często osoba dzieli się swoimi pomysłami z innymi, łączy różne pomysły w celu stworzenia czegoś nowego, zaskakuje innowacyjnymi rozwiązaniami oraz angażuje się w działania artystyczne. Uwzględnij także preferencje dotyczące pracy nad projektami wymagającymi nowatorskiego podejścia.</p>
<b>Refleksja i Rozwój:</b>
<p>Oceń, jak często osoba akceptuje i wdraża konstruktywną krytykę swoich pomysłów, jak radzi sobie z blokadą twórczą oraz jak często pracuje nad projektami twórczymi samodzielnie. Uwzględnij także zdolność zmiany perspektywy oraz wykorzystanie kreatywności w codziennych sytuacjach.</p>

Szczegółowo podsumuj oraz określ, czy na podstawie tych pytań można wskazać, jaki jest poziom kreatywności osoby badanej oraz jakie obszary wymagają dalszego rozwoju. W podsumowaniu możesz wskazać ${(addprompt)} W odpowiedzi nie używaj znaków **, zamiast tego odpowiednie fragmenty umieść w znacznikach <b>, a akapity w znacznikach <p>. Pytania i odpowiedzi osoby badanej dla wieku dorosłego:
`;
promptParam = `Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej dotyczące kreatywności oraz wstępna analiza odpowiedzi. Q: to pytanie A: odpowiedź. Przeanalizuj pytania i odpowiedzi oraz wstępną analizę i określ odpowiednie wskaźniki oceniające poziom kreatywności osoby badanej w skali od 1 do 10. Skala oceny wygląda następująco: 1 oznacza brak lub bardzo niski poziom kreatywności, 10 oznacza bardzo wysoki poziom kreatywności. Uwzględnij ocenę w następujących obszarach oraz dodaj krótkie wyjaśnienie dla każdego wskaźnika. Odpowiedź przygotuj w formacie JSON:

{
  \"Wskazniki\": {
    \"Generowanie Pomysłów\": 8,
    \"Kreatywne Rozwiązywanie Problemów\": 7,
    \"Współpraca i Działanie\": 9,
    \"Refleksja i Rozwój\": 6
  },
  \"Wyjasnienia\": {
    \"Generowanie Pomysłów\": \"Osoba często znajduje nowe sposoby rozwiązania problemów i generuje różnorodne pomysły, ale czasami ma trudności z przystosowaniem swoich pomysłów do zmieniających się okoliczności.\",
    \"Kreatywne Rozwiązywanie Problemów\": \"Osoba regularnie kwestionuje tradycyjne sposoby myślenia i angażuje się w twórcze projekty, ale pod presją czasu czasami ma trudności ze znalezieniem nieszablonowych rozwiązań.\",
    \"Współpraca i Działanie\": \"Osoba chętnie dzieli się swoimi pomysłami, łączy różne koncepcje i angażuje się w projekty wymagające nowatorskiego podejścia.\",
    \"Refleksja i Rozwój\": \"Osoba czasami akceptuje konstruktywną krytykę i radzi sobie z blokadą twórczą, ale mogłaby częściej wykorzystywać kreatywność w codziennych sytuacjach.\"
  }
}

\n\n<b>Definicja skali dla każdego wskaźnika:</b>\n\n<b>Generowanie Pomysłów:</b>\n1: Brak umiejętności generowania nowych pomysłów i przystosowania ich do zmieniających się okoliczności.\n10: Bardzo wysoki poziom umiejętności generowania różnorodnych pomysłów, przystosowania ich do zmieniających się okoliczności oraz eksperymentowania z nowymi metodami pracy.\n\n<b>Kreatywne Rozwiązywanie Problemów:</b>\n1: Brak umiejętności kwestionowania tradycyjnych sposobów myślenia i znajdowania nieszablonowych rozwiązań.\n10: Bardzo wysoki poziom kreatywności w rozwiązywaniu problemów, angażowanie się w twórcze projekty i poszukiwanie nowych doświadczeń.\n\n<b>Współpraca i Działanie:</b>\n1: Brak umiejętności współpracy nad projektami kreatywnymi i dzielenia się pomysłami.\n10: Bardzo wysoki poziom współpracy, dzielenia się pomysłami, łączenia różnych koncepcji oraz angażowania się w działania artystyczne.\n\n<b>Refleksja i Rozwój:</b>\n1: Brak refleksji nad własną kreatywnością, brak akceptacji konstruktywnej krytyki, brak radzenia sobie z blokadą twórczą.\n10: Bardzo wysoki poziom refleksji nad własną kreatywnością, akceptacja konstruktywnej krytyki, radzenie sobie z blokadą twórczą i częste wykorzystywanie kreatywności w codziennych sytuacjach. Pytania i odpowiedzi osoby badanej dla wieku dorosłego: `;
        break;

      default:
        // Kod do wykonania, gdy żaden z powyższych przypadków nie jest spełniony
        break;
    };

    //console.log("pełny prompt: " + prompt + text);

    const completion = await openai.chat.completions.create({
      model: "o1-preview-2024-09-12",
      messages: [{ role: "user", content: prompt + text }],
      //temperature: 1,
    });
    //console.log("przed parsowaniu: " + completion.choices[0].message.content);

    const contentFull = completion.choices[0].message.content;
    const ContentShortMail = contentFull.length > 400 ? contentFull.substring(0, 400) + '...' : contentFull;

    const rusultWithBr = contentFull.replace(/\n/g, "");

    const completionParam = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      response_format: { "type": "json_object" },
      messages: [{ role: "user", content: promptParam + text + ' Wstępna analiza pytań i odpowiedzi: ' + contentFull }],
      temperature: 1,
    });
    //console.log("przed parsowaniu: " + completion.choices[0].message.content);


    const contentParsed = JSON.parse(completionParam.choices[0].message.content);
    const wskazniki = contentParsed.Wskazniki;
    const wyjasnienia = contentParsed.Wyjasnienia || "";


    if (type !== "ADHDFullTest") {

      const result = {
        comment: rusultWithBr,
        wskazniki: wskazniki,
        wyjasnienia: wyjasnienia,
        survey: text,
        date: admin.database.ServerValue.TIMESTAMP,
        status: 0,
      };
      //await db.ref('secdata/' + uidSave + '/personal').update(result);
      const checkLimitRef = admin.database().ref(`secdata/${uidSave}/personal/limitTests`);
      const checkLimitRefTypeTest = admin.database().ref(`secdata/${uidSave}/personal/${type}`);
      try {
        await checkLimitRef.transaction(currentValue => {
          return (currentValue || 0) + 1;
        });
        await checkLimitRefTypeTest.transaction(currentValue => {
          return (currentValue || 0) + 1;
        });

      } catch (error) {
        console.error('Error incrementing check limit:', error);
      }




      await db.ref('Neuroinsights/' + uidSave + '/' + type).push({
        timestamp: admin.database.ServerValue.TIMESTAMP,
        ...result
      });
      // Pobierz e-mail użytkownika z Firestore
      const doc = await admin.firestore().collection('customers').doc(uidSave).get();
      const email = doc.data().email;
      let sourceVal = source;
      if (source === "adhdbuddy") {
        sourceVal = "https://app.adhdbuddy.me/neuroinsights/tests.html";
      } else {
        sourceVal =  "https://neuroinsights.me/app/surveys-results"
      };
      await admin.firestore().collection("mail").add({
        to: email,
        template: {
          name: "insightsmail",
          data: {
            comment: ContentShortMail,
            source: sourceVal 
          },
        },
      });

      const activityLevel = await checkUserActivityLevel(uid);
      console.log('Poziom aktywności użytkownika:', activityLevel);

    } else {
      const result = {
        comment: rusultWithBr,
        wskazniki: wskazniki,
        wyjasnienia: wyjasnienia,
        survey: text,
        date: admin.database.ServerValue.TIMESTAMP,
        status: 1,
      };
      await db.ref('testsUnpaid/' + uidSave + '/' + type).push({
        timestamp: admin.database.ServerValue.TIMESTAMP,
        ...result
      });
    }

    //console.log(result);
    //await db.ref('secdata/' + uidSave + '/personal').update(result);
    //await db.ref('ADHDFull/' + uidSave).update(result);

    return "<p>Dziękujemy. Poniżej krótkie podsumowanie Twojego testu</p> <br/>" + rusultWithBr;
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }
});

exports.surveyResponseFull = functions.region('europe-central2').runWith({ timeoutSeconds: 500 }).https.onCall(async (data, context) => {
  try {
    // Pobieranie referencji do Realtime Database


    const text = data.data.map(obj => `Q: ${obj.Q}\nA: ${obj.A}`).join('\n\n');
    const uidSave = data.uidSave;
    console.log('uidSave: ' + uidSave);

    // Pobieranie zawartości /survey/uid/survey z Realtime Database
    const surveyRef = admin.database().ref(`/surveys/${uidSave}/survey`);
    const surveySnapshot = await surveyRef.once('value');
    const baseResultADHD = surveySnapshot.val();


    const prompt = 'Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedz. Przeanalizuj podane pytania i odpowiedzi w kontekście diagnozy ADHD. Krótko wstępnie podsumuj oraz zasugeruj wstępnie kilka możliwych strategii. Użyj języka profesjonalnego i odwołuj się do metodologii badawczych dotyczących ADHD. Pytania i odpowiedzi dotyczą tej samej dorosłej osoby. Pytania i odpowiedzi osoby badanej dla wieku dorosłego: ' + baseResultADHD + ' Pytania i odpowiedzi osoby badanej z okresu dzieciństwa: ' + text;

    //    const prompt = 'Dalej znajdują się pytania i odpowiedzi ankiety osoby dorosłej. Q: to pytanie A: odpowiedz. Przeanalizuj podane pytania i odpowiedzi w kontekście diagnozy ADHD. Szczegółowo podsumuj oraz szczegółowo zaproponuj możliwe strategie. Użyj języka profesjonalnego i odwołuj się do metodologii badawczych dotyczących ADHD. Pytania i odpowiedzi dotyczą tej samej dorosłej osoby. Pytania i odpowiedzi osoby badanej dla wieku dorosłego: ' + baseResultADHD + ' Pytania i odpowiedzi osoby badanej z okresu dzieciństwa: ' + text;
    // const prompt = promptbefore.replace("Sprawdz odpowiedzi i zakończ Test", " ");

    console.log("pełny prompt: " + prompt);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });
    //console.log("przed parsowaniu: " + completion.choices[0].message.content);

    const contentFull = completion.choices[0].message.content;


    console.log("po parsowaniu: " + contentFull);
    //console.log("Parsed: " + contentParsed);
    const rusultWithBr = contentFull.replace(/\n/g, "<br/>");
    const email = "mariusz.duszczyk@exineo.pl";
    const mailFinal = `Użytkownik wypełnił test wieku dziecięcego <br/>` + rusultWithBr + `<br/>`;

    sendDataToEndpoint(email, mailFinal, 'standard');
    const result = {
      comment: contentFull,
      surveypartYoung: text,
      surveypartAdult: baseResultADHD,
      date: admin.database.ServerValue.TIMESTAMP,
      status: 0,
    };

    //console.log(result);
    //await db.ref('secdata/' + uidSave + '/personal').update(result);
    await db.ref('ADHDFull/' + uidSave).update(result);

    return "Dziękujemy. Wkrótce otrzymasz pałną analizę. Poniżej krótkie podsumowanie Twojego testu. Teraz Sztuczna inteligencja rozłozy Twoje odpowiedzi na czynniki pierwsze i przygotuje rozbudowaną analizę. Potem Któryś z naszych psychologów zweryfikuje i ostatecznie potwierdzi ocenę. Czas start :)<br/>" + rusultWithBr;
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }
});

exports.gathermindContekst = functions.region('europe-central2').runWith({ timeoutSeconds: 500 }).https.onCall(async (data, context) => {
  const longcontekst = data.long;
  const task = data.task;


  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini-2024-07-18',
    messages: [
      {
        role: 'system',
        content: `Jesteś pomocnym asystentem, który potrafi tworzyć szczegółowe opisy dla osób z ADHD. W opisie trzeba odnieść się do zadania: ${task}`
      },
      {
        role: 'user',
        content: `Wykonaj krótki opis do maksymalnie 50 słów: ${longcontekst}`
      }
    ],
    temperature: 0.8
  });

  return completion.choices[0].message.content;
});

exports.monitorAudioConvert = functions.region('europe-west1').runWith({ memory: '4GB', timeoutSeconds: 540 }).storage.object().onFinalize(async (object) => {

  const filePath = object.name; // File path in Firebase Storage

  // Check if the file is in the tempAudio directory and has an appropriate extension
  if (filePath.startsWith('tempAudio/') && (filePath.endsWith('.mp4') || filePath.endsWith('.mp3') || filePath.endsWith('.m4a') || filePath.endsWith('.wav') || filePath.endsWith('.webm'))) {
    const parts = filePath.split('/');
    if (parts.length === 4) { // The path should look like "tempAudio/{uidSave}/{typeTask}/{filename}"
      const uidSave = parts[1]; // Get the uidSave
      const typeTask = parts[2];
      const fileName = parts[3];
      const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');


      const newDestination = "audioOpenAi/" + uidSave + '/' + typeTask + '/' + fileName;

      console.log('Audio file created for user ' + uidSave + ', type: ' + typeTask + ': ' + filePath);

      const file = admin.storage().bucket().file(filePath);

      const tempLocalFile = path.join(os.tmpdir(), fileName);
      await file.download({ destination: tempLocalFile });

      // Funkcja do uzyskania czasu trwania pliku audio
      const getAudioDuration = (filePath) => {
        return new Promise((resolve, reject) => {
          ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
              reject(err);
            } else {
              const durationInSeconds = metadata.format.duration;
              resolve(durationInSeconds);
            }
          });
        });
      };

      // Pobranie czasu trwania pliku audio
      const duration = await getAudioDuration(tempLocalFile);
      const maxDuration = 40 * 60; // Maksymalna długość pliku audio (40 minut w sekundach)

      // Jeżeli plik jest dłuższy niż 40 minut, dzielimy go na fragmenty
      if (duration > maxDuration) {
        let part = 1;
        let startTime = 0;

        while (startTime < duration) {
          const endTime = Math.min(startTime + maxDuration, duration);
          const tempLocalPartFile = path.join(os.tmpdir(), `${fileNameWithoutExtension}_part${part}.mp4`);

          // Konwersja fragmentu pliku
          await new Promise((resolve, reject) => {
            ffmpeg(tempLocalFile)
              .setStartTime(startTime)
              .setDuration(endTime - startTime)
              .outputFormat('mp4')
              .audioCodec('aac')
              .audioBitrate(32) // Set the audio bitrate to 32k
              .audioChannels(1) // Set the number of audio channels to 1
              .audioFrequency(16000) // Set the audio frequency
              .output(tempLocalPartFile)
              .on('end', resolve)
              .on('error', reject)
              .run();
          });

          const newPartDestination = newDestination.replace(/\.(mp4|mp3|webm|wav|m4a)$/, `_part${part}.mp4`);

          // Upload fragmentu do Storage
          await admin.storage().bucket().upload(tempLocalPartFile, { destination: newPartDestination });

          // Usuwanie lokalnego pliku fragmentu
          unlinkSync(tempLocalPartFile);

          part += 1;
          startTime = endTime;
        }
      } else {
        // Jeśli plik jest krótszy niż 40 minut, konwertujemy cały plik
        const tempLocalMp4File = path.join(os.tmpdir(), fileNameWithoutExtension + 'after.mp4');

        await new Promise((resolve, reject) => {
          ffmpeg(tempLocalFile)
            .outputFormat('mp4')
            .audioCodec('aac')
            .audioBitrate(32) // Set the audio bitrate to 32k
            .audioChannels(1) // Set the number of audio channels to 1
            .audioFrequency(16000) // Set the audio frequency
            .output(tempLocalMp4File)
            .on('end', resolve)
            .on('error', reject)
            .run();
        });

        // Upload pliku do Storage
        await admin.storage().bucket().upload(tempLocalMp4File, { destination: newDestination.replace(/\.(mp4|mp3|webm|wav|m4a)$/, '.mp4') });

        // Usunięcie lokalnego pliku
        unlinkSync(tempLocalMp4File);
      }

      // Usunięcie oryginalnego pliku
      await file.delete();

      // Usunięcie lokalnego pliku
      unlinkSync(tempLocalFile);

      console.log('File conversion and upload completed for user ' + uidSave + ', type: ' + typeTask);
    }
  }
});

exports.monitorAudioConvertAssembly = functions.region('europe-west1').runWith({ memory: '4GB', timeoutSeconds: 540 }).storage.object().onFinalize(async (object) => {
  const filePath = object.name; // File path in Firebase Storage



  // Check if the file is in the assembly directory and has an appropriate extension
  if (filePath.startsWith('assembly/') && (filePath.endsWith('.mp4') || filePath.endsWith('.mp3') || filePath.endsWith('.m4a') || filePath.endsWith('.wav') || filePath.endsWith('.webm'))) {
    const parts = filePath.split('/');
    if (parts.length === 4) { // The path should look like "tempAudio/{uidSave}/{typeTask}/{filename}"
      const uidSave = parts[1]; // Get the uidSave
      const typeTask = parts[2];
      const fileName = parts[3];
      const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
      const uid = uidSave;

      const pathPartsFirst = object.name.split('/');
      const uidFirst = pathPartsFirst[1]; // Extract the UID from the path
      const typeTaskFirst = pathPartsFirst[2];
    
      const pathToContext = await admin.database().ref(`transcriptions/${uidFirst}/Contexts/${typeTaskFirst}/Context`).once('value');
      const pathToContextVal = pathToContext.val() || "";
      
      console.log('Audio file created in assembly directory: ' + filePath);
      let keyUpdate;

      const bucketName = 'adhd-buddy-383708.appspot.com';
      const token = object.metadata && object.metadata.firebaseStorageDownloadTokens;

      if (!token) {
        console.error('Token nie jest dostępny. Sprawdź metadane pliku w Storage.');
        return;
      }

      const audioUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media&token=${token}`;

      // Wysyłamy żądanie HTTP na endpoint API AssemblyAI przy użyciu biblioteki axios
      const endpoint = 'https://api.assemblyai.com/v2/transcript';
      const requestData = {
        audio_url: audioUrl,
        speaker_labels: true,
        language_detection: true,
        speech_model: "best",
        webhook_url: "https://europe-central2-adhd-buddy-383708.cloudfunctions.net/receiveFromAssembly"
      };

      try {
        const response = await axios.post(endpoint, requestData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'f3f9f8ee9993403882fbcd712fc3c01f',
          },
        });

        const keyRef = admin.database().ref(`transcriptions/${uid}`).push(); // Generate a new key
        const newKey = keyRef.key;
        keyUpdate = newKey;
        //const activityLevel = await checkUserActivityLevel(uid);
        //console.log('Poziom aktywności użytkownika:', activityLevel);
        //console.log('Język nagrania:', transcription.language);
    
        //const newAssistant = await checkAndCreateAssistant(uid);
        //console.log('newAssistant:', newAssistant.assistantIdFn);
        
   
        // Pobierz temp photoAi
        const tempAiPhoto = await admin.database().ref(`adhdcontent/tempAiPhoto`).once('value');
        const photoAiBase = tempAiPhoto.val();
    
        await keyRef.set({
          photoAi: photoAiBase,
          fileName: fileName,
          filePath: filePath,
          date: admin.database.ServerValue.TIMESTAMP,
          transContent: pathToContextVal,
          typeTask: 'Transkrypcja wstępna.',
          transcripted: true,
          title: 'Transkrypcja wstępna gotowa. Trwa korekta',
          readyForSpeakersUpdated: 2,
          transcriptedGoogle: false,
          aiRating: "Nie uruchomiłeś jeszcze oceny transkrypcji",
          sumAdvAi: "Metoda SMART to narzędzie służące do określania celów, które są Sprecyzowane, Mierzalne, Ambitne, Realistyczne i Terminowe. Dzięki analizie SMART, cele stają się bardziej klarowne i osiągalne, co ułatwia monitorowanie postępów i zwiększa motywację do ich realizacji.",
          summaryclean: "<h3>Zanim wykonasz pozostałe akcje (np. Podsumowanie), najpierw wykonaj korektę transkrypcji!</h3>"
        });
    
    
    
        //Tutaj korekta
    
        const path = `transcriptions/${uid}/${newKey}/fileContentVerbose`;
        const snapshotImageStyle = await admin.database().ref(`secdata/${uid}/personal/selectedImageStyle`).once('value');
        const imageStyle = snapshotImageStyle.val() || "Color";
        const addedContext = pathToContextVal;
        const position = newKey;
        const imageId = imageStyle;






        console.log('Response:', response.data.id);
        await admin.database().ref(`transcriptions/transWait/${response.data.id}`).set({
          uid: uidSave,
          position: position
        });
      } catch (error) {
        console.error('Błąd podczas wysyłania żądania:', error);
      }

    }
  }
});

exports.receiveFromAssembly = functions.region('europe-central2').runWith({ memory: '8GB', timeoutSeconds: 540 }).https.onRequest(async (req, res) => {
  const { transcript_id, status } = req.body;
console.log("transcript_id: " + transcript_id);
console.log("status: " + status);
const pathUid = await admin.database().ref(`transcriptions/transWait/${transcript_id}/uid`).once('value');
const uid = pathUid.val();
const pathposition = await admin.database().ref(`transcriptions/transWait/${transcript_id}/position`).once('value');
const position = pathposition.val();
console.log("uid: " + uid);
console.log("position: " + position);
const keyRefSum = admin.database().ref(`transcriptions/${uid}/${position}/transContent`);
const keyRefSumUpdated = admin.database().ref(`transcriptions/${uid}/${position}`);
const snapshot = await keyRefSum.once('value'); // Możesz też użyć: const snapshot = await keyRefSum.get();
const sumContext = snapshot.val();
const oldTrans = admin.database().ref(`transcriptions/${uid}/${position}/oldTrans`);
const oldTransSnapShot = await oldTrans.once('value'); // Możesz też użyć: const snapshot = await keyRefSum.get();
const oldTransVal = oldTransSnapShot.val();
const imageAiBase = admin.database().ref(`secdata/${uid}/personal/selectedImageStyle`);
const imageIdSnapshot = await imageAiBase.once('value'); // Możesz też użyć: const snapshot = await keyRefSum.get();
const imageId = imageIdSnapshot.val();
let lanquageSource;

if (oldTransVal === 1) {
  return res.status(200).send('Dane zostały zaktualizowane pomyślnie');
}




//const pathToContext = await admin.database().ref(`transcriptions/${uid}/Contexts/${typeTaskFirst}/Context`).once('value');
//const pathToContextVal = pathToContext.val() || "";

      // Wysyłamy żądanie HTTP na endpoint API AssemblyAI przy użyciu biblioteki axios
      const endpoint = `https://api.assemblyai.com/v2/transcript/${transcript_id}`;

      try {
        const responseAssembly = await axios.get(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'f3f9f8ee9993403882fbcd712fc3c01f',
          },
        });
        console.log('Response:', responseAssembly.data.status);
       const fullTranscript = responseAssembly.data.utterances.map((utterance) => {
         return {
            start: (utterance.start / 1000).toFixed(2),
            end: (utterance.end / 1000).toFixed(2),
            text: utterance.text,
            speaker: utterance.speaker
          };
        });
       console.log(JSON.stringify(responseAssembly.data.utterances));
       console.log(JSON.stringify(responseAssembly.data.language_code));
       let lanquageSource = responseAssembly.data.language_code;

        const oldTranscript = responseAssembly.data.utterances.map((utterance) => {
          return {
            start: (utterance.start / 1000).toFixed(2),
            end: (utterance.end / 1000).toFixed(2),
            text: utterance.text
          };
        });
        const fileContentVerbose = JSON.stringify(oldTranscript);
        const fileContentVerboseNew = JSON.stringify(fullTranscript);
        //console.log(fileContentVerbose);
        //console.log("fileContentVerboseNew: " + fileContentVerboseNew);
        const path =  admin.database().ref(`transcriptions/${uid}/${position}`);
        console.log("uid: " + uid);
        console.log("position: " + position);
        await path.update({
        fileContentVerbose: fileContentVerbose,
        title: 'Juz za chwilę...',
        fileContentVerboseNew: fileContentVerboseNew,
        oldTrans: 1
    });

            const endpointSum = 'https://api.assemblyai.com/lemur/v3/generate/summary';
            const requestDataSum = {
              context: sumContext + ". Przygotuj krótkie podsumowanie oraz zidentyfikuj uczestników na podstawie treści transkrypcji. Odpowiedz w języku o kodzie: " + lanquageSource,
              final_model: "anthropic/claude-3-5-sonnet",
              max_output_size: 4000,
              temperature: 0.5,
              transcript_ids: [
                transcript_id
              ]
            };
      
            try {
              const responseSum = await axios.post(endpointSum, requestDataSum, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'f3f9f8ee9993403882fbcd712fc3c01f',
                },
              });

              console.log('Response:', responseSum.data.response);
      
              
              
          
              await keyRefSumUpdated.update({
                title: 'Transkrypcja wstępna gotowa. Działamy dalej...',
                summaryclean: responseSum.data.response
              });


// Zapytanie o tytuł i kategorię
const titleResponse = await openai.chat.completions.create({
  model: "gpt-4o-mini-2024-07-18",
  response_format: { type: "json_object" },
  messages: [
    { role: 'user', content: `Określ najbardziej pasujący tytuł oraz kategorię. Odpowiedz podaj w JSON w strukturze: {"title": "tytuł", "cat": "kategoria"}. Odpowiedz w języku o kodzie:  ${lanquageSource}. Treść do analizy: ${responseSum.data.response} ` }
    //{ role: 'user', content: `Określ najbardziej pasujący tytuł oraz kategorię. Odpowiedz podaj w JSON w strukturze: {"title": "tytuł", "cat": "kategoria"}. Treść do analizy: Spotkanie projektowe` }
  ],
  temperature: 0.7,
});

const titleData = JSON.parse(titleResponse.choices[0].message.content);
const title = titleData.title;
const category = titleData.cat;

const promptSelectedGTA = `Create a dynamic and detailed image in the style of a GTA video game cover for the theme: ${title}. The context includes ${responseSum.data.response}. The image should include bold lines, vibrant colors, and a cityscape or action-oriented background, with elements like characters, icons, and tools integrated to reflect the chaos and intensity typical of GTA covers.`;
const promptSelectedReal = `Create an exceptionally realistic, high-quality photograph on the theme: ${title}. The context includes ${responseSum.data.response}. The image should capture natural lighting, authentic textures, and true-to-life colors, focusing on details to make the scene look as if it was taken by a professional camera.`;
const promptSelectedColor = `Create a vivid, colorful illustration on the theme: ${title}. The context includes ${responseSum.data.response}. The image should feature intense, saturated colors with minimal details, emphasizing simple shapes and forms to create a "juicy," eye-catching visual effect that is both fun and expressive.`;

let promptSelected = promptSelectedGTA;
let style = "vivid";

if (imageId === 'GTA') {
  promptSelected = promptSelectedGTA;
  style = "natural";
} else if (imageId === 'Real') {
  promptSelected = promptSelectedReal;
  style = "natural";
} else if (imageId === 'Color') {
  promptSelected = promptSelectedColor;
  style = "natural";
} else {
  promptSelected = promptSelectedGTA;
  style = "vivid"; // Domyślny prompt
}

// Generowanie obrazu z DALL-E
const imageResponse = await openai.images.generate({
  prompt: promptSelected,
  model: "dall-e-3",
  n: 1,
  size: "1024x1024",
  response_format: "b64_json",
  style: style,
});

const imageBase64 = imageResponse.data[0].b64_json;

await keyRefSumUpdated.update({
  titleTemp: title,
  title: "Jeszcze tylko korekta uczestników....",
  typeTask: category,
  summaryclean: responseSum.data.response,
  photoAi: imageBase64,
  photoGenerated: true,
  lanquageSource: lanquageSource,
  readyForSpeakersUpdated: 1
});
              
          
          
            } catch (error) {
              console.error('Błąd podczas wysyłania żądania:', error);
            }

    return res.status(200).send('Dane zostały zaktualizowane pomyślnie');
        

      } catch (error) {
        console.error('Błąd podczas wysyłania żądania:', error);
      }

});

exports.correctNewTranscription = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '1GB' }).https.onCall(async (data, context) => {
  const position = data.positionid;
  const key = position;
  const correctedTrans = data.correctedTrans;
  const uid = context.auth.uid;
  const path = `transcriptions/${uid}/${position}`;
  //const keyRef = admin.database().ref(path).set(); // Generate a new key

  await admin.database().ref(path).update({
    fileContentVerboseNew: correctedTrans
  });

  await updateSingleTranscription(uid, key)


});

// Monitor new audio files
exports.monitorAudioUpload = functions.region('europe-west1').runWith({ timeoutSeconds: 540 }).storage.object().onFinalize(async (object) => {
  const filePath = object.name; // File path in Firebase Storage

  // Check if the file is an audio file
  if (filePath.startsWith('audio/') && (filePath.endsWith('.webm') || filePath.endsWith('.mp4'))) {
    const parts = filePath.split('/');
    if (parts.length === 4) { // The path should look like "audio/{uidSave}/{typeTask}/{filename}"
      const uidSave = parts[1]; // Get the uidSave
      const typeTask = parts[2];
      const fileName = parts[3];

      console.log('Audio file created for user ' + uidSave + ', type: ' + typeTask + ': ' + filePath);

      const file = admin.storage().bucket().file(filePath);
      //console.log('wielkość pliku: ' + file.size);


      const tempLocalFile = path.join(os.tmpdir(), fileName);
      await file.download({ destination: tempLocalFile });

      //pobierz temp photoAi
      const tempAiPhoto = await admin.database().ref(`adhdcontent/tempAiPhoto`).once('value');
      let photoAiBase = tempAiPhoto.val();


      // Add an entry to the Realtime Database with initial "transcripted" status set to false
      db.ref('transcriptions/' + uidSave).push({
        //fileContentVerbose: 'Trwa transkrypcja i wstępna analiza',
        photoAi: photoAiBase,
        fileName: fileName,
        filePath: filePath,
        date: admin.database.ServerValue.TIMESTAMP,
        typeTask: typeTask,
        transcripted: true,
        //fileContent: 'Trwa transkrypcja i wstępna analiza',
        title: 'Trwa transkrypcja',
        //summary: transcriptopenai.data.text
        //summary: 'Trwa transkrypcja i wstępna analiza'
      }, function (error) {
        if (error) {
          console.error('Data could not be saved.' + error);
          db.ref('transcriptions/' + uidSave).push({
            fileName: fileName,
            filePath: filePath,
            date: admin.database.ServerValue.TIMESTAMP,
            typeTask: typeTask,
            transcripted: true,
            //fileContent: 'Trwa transkrypcja i analiza',
            title: 'Wystąpił błąd. odpowiedz serwera: ' + error
          });
        } else {
          console.log('Data saved successfully.');
        }
      });

    }
  }
});

exports.addContextToTranslation = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '1GB' }).https.onCall(async (data, context) => {
  const idContext = data.id;
  const Context = data.context;
  const uid = context.auth.uid;
  const path = `transcriptions/${uid}/Contexts/${idContext}`;
  console.log("idContext: " + idContext);
  console.log("Context: " + Context);
  console.log("uid: " + uid);
  console.log("path: " + path);

  //const keyRef = admin.database().ref(path).set(); // Generate a new key

  await admin.database().ref(path).set({
    Context: Context
  });


});

exports.convertYouTubeToMp3 = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '1GB' }).https.onCall(async (data, context) => {
    const linkYouTube = data.url;
    const uid = context.auth.uid;
    console.log("linkYouTube: " + linkYouTube);
    console.log("uid: " + uid);

    if (!linkYouTube || !uid) {
      throw new functions.https.HttpsError('invalid-argument', 'LinkYouTube and UID must be provided.');
    }

    const downloadOptions = {
      method: 'POST',
      url: 'https://youtube-to-mp315.p.rapidapi.com/download',
      params: {
        url: linkYouTube,
        format: 'mp3',
        quality: '8'
      },
      headers: {
        'x-rapidapi-key': '1e9ba6ff40mshb9f36fbc98566e4p1ea06ejsnf91cdedb13a9',
        'x-rapidapi-host': 'youtube-to-mp315.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {}
    };

    try {
      // Pierwsze żądanie do rozpoczęcia pobierania
      const downloadResponse = await axios.request(downloadOptions);
      const { status, id } = downloadResponse.data;
      console.log("status: " + status );
      console.log("id: " + id );

      if (!status) {
        throw new functions.https.HttpsError('internal', 'Failed to start download process.');
      }

      // Czekaj 120 sekund
      await new Promise(resolve => setTimeout(resolve, 60000));

      // Zapytanie o status pobierania
      let progressResponse;
      let finished = false;

      while (!finished) {
        const progressOptions = {
          method: 'GET',
          url: `https://youtube-to-mp315.p.rapidapi.com/status/${id}`,
          headers: {
              'x-rapidapi-key': '1e9ba6ff40mshb9f36fbc98566e4p1ea06ejsnf91cdedb13a9',
              'x-rapidapi-host': 'youtube-to-mp315.p.rapidapi.com'
          }
        };

        console.log("progressOptions: " + JSON.stringify(progressOptions));

        progressResponse = await axios.request(progressOptions);
        const { status, downloadUrl } = progressResponse.data;
        console.log("status2: " + status );
        console.log("downloadUrl: " + downloadUrl );

        if (!status) {
          throw new functions.https.HttpsError('internal', 'Failed to get download progress.');
        }

        if (status === 'AVAILABLE') {
          finished = true;

          // Pobierz plik z download_url
          const response = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'stream'
          });

          // Zapisz plik do systemu plików
          const tempFilePath = path.join(os.tmpdir(), `${id}.mp3`);
          const tempFile = fsdemo.createWriteStream(tempFilePath);
          await new Promise((resolve, reject) => {
            response.data.pipe(tempFile);
            response.data.on('end', resolve);
            response.data.on('error', reject);
          });

          // Prześlij plik do Firebase Storage
          const destination = `assembly/${uid}/idea/${id}.mp3`;
          await bucket.upload(tempFilePath, {
            destination,
            metadata: {
              contentType: 'audio/mpeg'
            }
          });

          // Usuń plik tymczasowy
          fsdemo.unlinkSync(tempFilePath);

          return { success: true, download_url: destination };
        } else {
          // Czekaj kolejne 60 sekund
          await new Promise(resolve => setTimeout(resolve, 60000));
        }
      }
    } catch (error) {
      console.error('Error during YouTube to MP3 conversion:', error);
      throw new functions.https.HttpsError('internal', 'An error occurred during the conversion process.');
    }
});

exports.infoYouTube = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const linkYouTube = data.url;
  const uid = context.auth.uid;
  console.log("linkYouTube: " + linkYouTube);
  console.log("uid: " + uid);

  if (!linkYouTube || !uid) {
    throw new functions.https.HttpsError('invalid-argument', 'LinkYouTube and UID must be provided.');
  }

  const idYT = extractYouTubeId(linkYouTube);

  const infoOptions = {
    method: 'GET',
    url: 'https://yt-api.p.rapidapi.com/video/info',
    params: {id: idYT},
    headers: {
      'x-rapidapi-key': '1e9ba6ff40mshb9f36fbc98566e4p1ea06ejsnf91cdedb13a9',
      'x-rapidapi-host': 'yt-api.p.rapidapi.com'
    }
  };

  try {
    const infoResponse = await axios.request(infoOptions);
    const { title, description, lengthSeconds, id } = infoResponse.data;
    const shortDescription = truncateString(description, 200);
    console.log("title: " + title );
    console.log("description: " + shortDescription );
    console.log("lengthSeconds: " + lengthSeconds );

    if (!id) {
      throw new functions.https.HttpsError('internal', 'Failed to start download process.');
    }

    return { success: true, title: title, description: shortDescription, lengthSeconds: lengthSeconds };

  } catch (error) {
    console.error('Error during YouTube info:', error);
    throw new functions.https.HttpsError('internal', 'An error occurred during the conversion process.');
  }
});


exports.convertFacebookToMp3 = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '1GB' }).https.onCall(async (data, context) => {
  const facebookUrl = data.url;
  const uid = context.auth.uid;

  console.log("facebookUrl: " + facebookUrl);
  console.log("uid: " + uid);

  if (!facebookUrl || !uid) {
    throw new functions.https.HttpsError('invalid-argument', 'Facebook URL and UID must be provided.');
  }

  const options = {
    method: 'GET',
    url: 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/facebook',
    params: { url: facebookUrl },
    headers: {
      'x-rapidapi-key': '1e9ba6ff40mshb9f36fbc98566e4p1ea06ejsnf91cdedb13a9',
      'x-rapidapi-host': 'social-media-video-downloader.p.rapidapi.com'
    }
  };

  try {
    // Wysyłanie żądania pobierania
    const response = await axios.request(options);
    console.log(response.data);

    const { links } = response.data;
    if (!links || links.length === 0) {
      throw new functions.https.HttpsError('internal', 'No audio links found.');
    }

    // Znajdź link do audio
    const audioLink = links.find(link => link.quality === 'audio_0');
    if (!audioLink) {
      throw new functions.https.HttpsError('internal', 'Audio link not available.');
    }

    // Pobierz plik audio
    const audioResponse = await axios({
      url: audioLink.link,
      method: 'GET',
      responseType: 'stream'
    });

    // Zapisz plik do systemu plików tymczasowych
    const tempFilePath = path.join(os.tmpdir(), `${uid}_facebook_audio.mp3`);
    const tempFile = fsdemo.createWriteStream(tempFilePath);

    await new Promise((resolve, reject) => {
      audioResponse.data.pipe(tempFile);
      audioResponse.data.on('end', resolve);
      audioResponse.data.on('error', reject);
    });

    // Prześlij plik do Firebase Storage
    const destination = `assembly/${uid}/idea/${Date.now()}.mp3`;
    await bucket.upload(tempFilePath, {
      destination,
      metadata: {
        contentType: 'audio/mpeg'
      }
    });

    // Usuń plik tymczasowy
    fsdemo.unlinkSync(tempFilePath);

    return { success: true, download_url: destination };
  } catch (error) {
    console.error('Error during Facebook audio conversion:', error);
    throw new functions.https.HttpsError('internal', 'An error occurred during the conversion process.');
  }
});

exports.infoFacebook = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const facebookUrl = data.url;
  const uid = context.auth.uid;

  console.log("facebookUrl: " + facebookUrl);
  console.log("uid: " + uid);

  if (!facebookUrl || !uid) {
    throw new functions.https.HttpsError('invalid-argument', 'Facebook URL and UID must be provided.');
  }

  const infoOptions = {
    method: 'GET',
    url: 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/facebook',
    params: { url: facebookUrl },
    headers: {
      'x-rapidapi-key': '1e9ba6ff40mshb9f36fbc98566e4p1ea06ejsnf91cdedb13a9',
      'x-rapidapi-host': 'social-media-video-downloader.p.rapidapi.com'
    }
  };

  try {
    // Wysyłanie żądania pobierania
    const infoResponse = await axios.request(infoOptions);
    const { title, og_url, picture, links } = infoResponse.data;

    console.log("title: " + title );
    console.log("og_url: " + og_url );
    console.log("picture: " + picture );

    // Znajdywanie jakości video
    const videoInfo = links.find(link => link.quality.includes('video_hd') || link.quality.includes('video_sd'));

    if (!videoInfo) {
      throw new functions.https.HttpsError('internal', 'Video information not available.');
    }

    // Zwracanie informacji o filmie
    return { 
      success: true, 
      title: title, 
      video_url: videoInfo.link, 
      og_url: og_url, 
      thumbnail: picture 
    };

  } catch (error) {
    console.error('Error during Facebook info retrieval:', error);
    throw new functions.https.HttpsError('internal', 'An error occurred during the information retrieval process.');
  }
});


exports.processAudioFile = functions.region('europe-central2').runWith({ memory: '4GB', timeoutSeconds: 540 }).storage.bucket().object().onFinalize(async (object) => {
  if (!(/\.(m4a|mp3|webm|mp4)$/i).test(object.name) || !object.name.startsWith('audioOpenAi/')) {
    console.log('File is not a supported audio file in the audioOpenAi/ folder.');
    return null;
  }

  const fileLocation = path.join(os.tmpdir(), path.basename(object.name));
  await bucket.file(object.name).download({ destination: fileLocation });

  const fileBuffer = await fs.readFile(fileLocation);
  const pathPartsFirst = object.name.split('/');
  const uidFirst = pathPartsFirst[1]; // Extract the UID from the path
  const typeTaskFirst = pathPartsFirst[2];

  const pathToContext = await admin.database().ref(`transcriptions/${uidFirst}/Contexts/${typeTaskFirst}/Context`).once('value');
  const pathToContextVal = pathToContext.val() || "";
  const form = new FormData();
  form.append('file', fileBuffer, path.basename(fileLocation));
  form.append('model', 'whisper-1');
  form.append('response_format', 'verbose_json');
  form.append('timestamp_granularities[]', 'segment');
  form.append('prompt', pathToContextVal);
  const headers = {
    ...form.getHeaders(),
    'Authorization': `Bearer ${openaiApiKey}`
  };

  try {

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, { headers });
    const transcription = response.data;

    const pathParts = object.name.split('/');
    const uid = pathParts[1]; // Extract the UID from the path
    const typeTask = pathParts[2];
    const fileName = pathParts[3];
    const filePath = object.name;
    const uidSave = uid;

    const keyRef = admin.database().ref(`transcriptions/${uid}`).push(); // Generate a new key
    const newKey = keyRef.key;
    const activityLevel = await checkUserActivityLevel(uid);
    console.log('Poziom aktywności użytkownika:', activityLevel);
    console.log('Język nagrania:', transcription.language);

    const newAssistant = await checkAndCreateAssistant(uid);
    console.log('newAssistant:', newAssistant.assistantIdFn);
    
    
    const segmentsData = transcription.segments.map(segment => ({
      start: segment.start,
      end: segment.end,
      text: segment.text
    }));

    const segmentsDataFull = transcription.segments.map(segment => ({
      text: segment.text
    }));
    //const segmentsDataFullString = JSON.stringify(segmentsDataFull).replace(/[{}]/g, '');
    const segmentsDataFullString = JSON.stringify(segmentsDataFull)
      .replace(/[{}]/g, '')  // Usuwa znaki { i }
      .replace(/\btext\b/g, '') // Usuwa słowo "text"
      .replace(/\.\./g, ''); // Usuwa ciąg ".."


    // Pobierz temp photoAi
    const tempAiPhoto = await admin.database().ref(`adhdcontent/tempAiPhoto`).once('value');
    const photoAiBase = tempAiPhoto.val();

    await keyRef.set({
      photoAi: photoAiBase,
      fileName: fileName,
      filePath: filePath,
      date: admin.database.ServerValue.TIMESTAMP,
      transContent: pathToContextVal,
      typeTask: 'Transkrypcja wstępna.',
      transcripted: true,
      title: 'Transkrypcja wstępna gotowa. Trwa korekta',
      transcriptedGoogle: false,
      transcript: segmentsDataFullString,
      aiRating: "Nie uruchomiłeś jeszcze oceny transkrypcji",
      sumAdvAi: "Nie podsumowałes jeszcze transkrypcji korzystająć z zaawansowanych opcji AI",
      summaryclean: "<h3>Zanim wykonasz pozostałe akcje (np. Podsumowanie), najpierw wykonaj korektę transkrypcji!</h3>",
      fileContentVerbose: JSON.stringify(segmentsData)
    });



    //Tutaj korekta

    const path = `transcriptions/${uid}/${newKey}/fileContentVerbose`;

  // Pobieranie danych z Firebase
  const snapshot = await admin.database().ref(path).once('value');
  const text = snapshot.val();
  const snapshotImageStyle = await admin.database().ref(`secdata/${uid}/personal/selectedImageStyle`).once('value');
  const imageStyle = snapshotImageStyle.val() || "Color";
  const addedContext = pathToContextVal;
  const language = transcription.language;
  const position = newKey;
  const imageId = imageStyle;

  if (!text) {
    return { error: 'Brak tekstu w bazie danych' };
  }

  // Wywołanie endpointu Google Cloud Run asynchronicznie bez oczekiwania na odpowiedź
  axios.post('https://connectopenai-156055018925.europe-central2.run.app', {
    text,
    addedContext,
    uidSave,
    position,
    language,
    imageId,
  }).then(response => {
    console.log('Dane przekazane do Cloud Run:', response.data);
  }).catch(error => {
    console.error('Błąd wysyłania do Cloud Run:', error);
  });

  const childRef = admin.database().ref(`transcriptions/${uid}/${newKey}`);

    // Aktualizacja bazy danych Firebase
    await childRef.update({
      summaryclean: "<h3>Dane zostały przekazane do korekty.</h3><p>Po zakończeniu przetwarzania, korekta transkrypcji pojawi sie tutaj</p>"
    });





    console.log('Transcription stored in database with key:', keyRef.key);
  } catch (error) {
    console.error('Error during transcription:', error.response ? error.response.data : error.message);
  }

  await fs.unlink(fileLocation);

  




});


//Budowa listy zadań

exports.generateTasks = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const position = data.positionid;
  const uidSave = data.uidSave;
  const transcriptPath = `transcriptions/${uidSave}/${position}/summaryclean`;
  const sumFullPath = `transcriptions/${uidSave}/${position}/sumFull`;
  const titlePath = `transcriptions/${uidSave}/${position}/title`;
  const summarySnapshot = await admin.database().ref(transcriptPath).once('value');
  const sumFullSnapshot = await admin.database().ref(sumFullPath).once('value');
  const titleSnapshot = await admin.database().ref(titlePath).once('value');
  let summaryVal = summarySnapshot.val();
  let titleVal = titleSnapshot.val();
  let sumFull = sumFullSnapshot.val();
  
  
  const maxTokens = 100000;
  const fragments = [];
  for (let i = 0; i < summaryVal.length; i += maxTokens) {
    fragments.push(summaryVal.slice(i, i + maxTokens));
  }

  const results = [];

  for (let i = 0; i < fragments.length; i++) {
    const fragment = fragments[i];
    const impulsivitySnapshot = await admin.database().ref(`secdata/${uidSave}/personal/impulsivity`).once('value');
    let impulsivity = impulsivitySnapshot.val() || 1;

    const inattentionSnapshot = await admin.database().ref(`secdata/${uidSave}/personal/inattention`).once('value');
    let inattention = inattentionSnapshot.val() || 1;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [{ "role": "system", "content": "Jesteś asystentem dla osoby z okresloną impulsywnością na poziomie " + impulsivity + " w skali 1-10 oraz nieuważnością na poziomie " + inattention + " w skali 1-10. W swojej analizie nie wspominaj o tych wskaźnikach, jedynie uwzględnij w przygotowaniu odpowiedzi. " },
        { "role": "user", "content": "Zidentyfikuj najważniejsze zadania do wykonania i pogrupuj je tematycznie. Grupy tematyczne oraz zadania opisz dokładnie i bardzo szczegółowo tak, żeby kontekst był czytelny. Treść do analizy: " + fragment + " Uwzględnij dodatkowe informacje takie jak Podsumowanie : " + sumFull + " oraz tytuł: " +  titleVal}],
        temperature: 0.2,
      });
      const summaryOpenAi = completion.choices[0].message.content;
      //console.log("summaryOpenAi: " + summaryOpenAi);
      results[i] = summaryOpenAi;

      if (results.filter(Boolean).length === fragments.length) {
        const finalSummary = results.join(' ');
        console.log("finalSummary: " + finalSummary);


        const completion = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
          model: "gpt-4o-mini-2024-07-18",
          response_format: { "type": "json_object" },
          messages: [{ "role": "system", "content": "Jesteś profesjonalnym asystentem  " },
          { "role": "user", "content": "Zidentyfikowane zadania pogrupuj tematycznie. Przeprowadź ujednolicenie nazw i opisów tak, aby były prezentowane w zbliżony sposób. Grupy tematyczne oraz zadania opisz szczegółowo. Odpowiedz podaj tylko w JSON zwracając uwagę na poprawną budowę JSON. Każdy obiekt dziecko paragraphs musi składać się dokładnie z paragraph, content oraz więcej niż jednego task. Wymagana struktura JSON odpowiedzi: {\"paragraphs\": [{\"paragraph\": \"Logiczny tutuł grupy zadań związany z treścią\",\"content\": \"Szczegółowy opis grupy zadań pokazujący kontekst\",\"tasks\": [{\"task\": \"Szczegółowy opis zadania\"}]}]}. Treść do analizy: " + finalSummary + " Uwzględnij dodatkowe informacje takie jak Ogólne Podsumowanie : " + sumFull + " oraz tytuł całego dokumentu: " +  titleVal }],
          temperature: 0.2,
        });

        const summaryOpenAiTasks = completion.choices[0].message.content;
        console.log("summaryOpenAi: " + summaryOpenAiTasks);





        const childRef = admin.database().ref(`transcriptions/${uidSave}/${position}`);
        await childRef.update({
          tasksAi: summaryOpenAiTasks,
          tasksAiSource: finalSummary
        });
        // Przykład użycia:


        //const email = (await admin.firestore().collection('customers').doc(uidSave).get()).data().email;
        //const mailFinal = `Poniżej znajduje się przetworzona przez AI lista zadań. Znajdziesz ją w aplikacji pod linkiem: <a href="https://adhd-buddy-383708.firebaseapp.com/app/gathermind.html?otworz=${position}">Kliknij tutaj, aby przejść do strony</a><br/><br/>` + finalSummary.replace(/\n/g, "<br/>");

        //sendDataToEndpoint(email, mailFinal, 'standard');


        return summaryOpenAiTasks;
      }

    } catch (error) {
      console.error('Error processing request:', error);
    }
  }
});

exports.aggregateTranscriptionsTasks = functions.region('europe-central2').https.onCall(async (data, context) => {
  // Sprawdzenie, czy użytkownik jest zalogowany
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Musisz być zalogowany, aby wykonać tę operację.');
  }

  const uidSave = context.auth.uid;
  console.log("uidSave: " + uidSave);

  const dbRef = admin.database().ref();
  const transcriptionsRef = dbRef.child(`transcriptions/${uidSave}`);
  const result = [];

  try {
    const transcriptionsSnapshot = await transcriptionsRef.once('value');

    transcriptionsSnapshot.forEach(childSnapshot => {
      const key = childSnapshot.key;
      const data = childSnapshot.val();
      const tasksAiString = data.tasksAi;
      const title = data.typeTask + ': ' + data.title;  // Pobieranie wartości title
      const dataTask = data.date;

      if (tasksAiString) {
        const tasksAi = JSON.parse(tasksAiString); // Parsowanie tekstu JSON na obiekt
        tasksAi.paragraphs.forEach(paragraph => {
          const tasks = paragraph.tasks.map(task => ({
            task: task.task,
            select: task.select
          }));
          result.push({
            title,  // Dodanie wartości title do wyników
            data: dataTask,
            paragraph: paragraph.paragraph,
            content: paragraph.content,
            tasks: tasks
          });
        });
      }
    });

    // Zapisanie wyniku w Realtime Database
    const resultRef = dbRef.child(`secdata/${uidSave}/personal/transTasks`);
    await resultRef.set(JSON.stringify(result));

    return { tasks: result };
  } catch (error) {
    console.error('Error retrieving transcriptions tasks:', error);
    throw new functions.https.HttpsError('unknown', 'Wystąpił błąd podczas pobierania danych.');
  }
});

exports.generateSummarize = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const position = data.positionid;
  const uidSave = data.uidSave;
  const uid = uidSave;
  const key = position;
  const sumMode = data.mode;
  const addedContext = data.addedContext;
  const language = data.language;
  let asistantIdVal;
  let threadIdVal;
  const verOldTranSnapshot = await admin.database().ref(`transcriptions/${uidSave}/${position}/oldTrans`).once('value');
  
  if (!verOldTranSnapshot.exists()) { 
  const path = `transcriptions/${uid}/${position}/fileContentVerbose`;

  // Pobieranie danych z Firebase
  const snapshot = await admin.database().ref(path).once('value');
  const text = snapshot.val();
  const snapshotImageStyle = await admin.database().ref(`secdata/${uid}/personal/selectedImageStyle`).once('value');
  const imageStyle = snapshotImageStyle.val() || "Color";
  const imageId = imageStyle;

  if (!text) {
    return { error: 'Brak tekstu w bazie danych' };
  }

      // Update the entry with the summary
      const childRefUpdate = admin.database().ref(`transcriptions/${uidSave}/${position}`);
      if (sumMode === "sumAdvAi") {
        await childRefUpdate.update({
          sumAdvAi: "Wykonujemy aktualizacje Twojej transkrypcji. Może to potrwać od kilku, do nawet kilkunastu minut. Po aktualizacji będziesz mógł wykonać akcje ponownie"
        });
      } else {
        await childRefUpdate.update({
          summaryPre: "Wykonujemy aktualizacje Twojej transkrypcji. Może to potrwać od kilku, do nawet kilkunastu minut. Po aktualizacji będziesz mógł wykonać akcje ponownie"
        });
      }

 await axios.post('https://connectopenai-156055018925.europe-central2.run.app', {
    text,
    addedContext,
    uidSave,
    position,
    language,
    imageId,
  }).then(response => {
    console.log('Dane przekazane do Cloud Run:', response.data);
  }).catch(error => {
    console.error('Błąd wysyłania do Cloud Run:', error);
  });
  }
 

    // Pobieranie wartości impulsivity i inattention z bazy danych
    const impulsivitySnapshot = await admin.database().ref(`secdata/${uidSave}/personal/impulsivity`).once('value');
    let impulsivity = impulsivitySnapshot.val();
  
    const inattentionSnapshot = await admin.database().ref(`secdata/${uidSave}/personal/inattention`).once('value');
    let inattention = inattentionSnapshot.val();

    const asistantId = await admin.database().ref(`secdata/${uidSave}/personal/assistantOpenAiFn`).once('value');
    if (!asistantId.exists()) {
      let assistantId = await checkAndCreateAssistant(uid);
      asistantIdVal = assistantId.assistantIdFn;
    }
    asistantIdVal = asistantId.val();
    console.log("asistantIdVal: " + asistantIdVal);

    const transTitle = await admin.database().ref(`transcriptions/${uidSave}/${position}/title`).once('value');
    let transTitleVal = transTitle.val();
    const transSum = await admin.database().ref(`transcriptions/${uidSave}/${position}/summaryclean`).once('value');
    let transSumVal = transSum.val();
    const fileIdSnap = await admin.database().ref(`transcriptions/${uidSave}/${position}/fileId`).once('value');
    let fileIdVal = fileIdSnap.val();


    const threadId = await admin.database().ref(`transcriptions/${uidSave}/${position}/newThreadTrans`).once('value');
    if (!threadId.exists()) {
      console.log("asistantIdVal2: " + asistantIdVal);
      const ThreadAdd = await openai.beta.threads.create();
      threadIdVal = ThreadAdd.id;
      console.log("threadIdVal: " + threadIdVal);

      const childRefThread = admin.database().ref(`transcriptions/${uidSave}/${position}`);
        await childRefThread.update({
        newThreadTrans: threadIdVal
      });

      const messageThreadAdd = await openai.beta.threads.messages.create(
        threadIdVal,
          {
            role: "user",
            content: "Title: " + transTitleVal + " Transkrypcja nagrania: " + transSumVal
          });
    }
    threadIdVal = threadId.val();
    console.log("threadIdVal: " + threadIdVal);

  
    // Jeśli impulsivity lub inattention są null lub undefined, ustawiamy je na 1
    impulsivity = impulsivity || 1;
    inattention = inattention || 1;
    console.log('Impulsywność i Nieuwazność:' + impulsivity + ',' + inattention);

    if (impulsivity !== 1 || inattention !==1) {
      var adhdParametr = ". W szczegółowości i formie odpowiedzi uwzględnij i ją dostosuj do tego, że odpowiedz przygotowujesz dla osoby po teście na ADHD ze wskaźnikami Impulsywność na poziomie " + impulsivity + " w skali od 1 do 10 oraz Nieuwazność na poziomie " + inattention + " w skali od 1 do 10. W samej odpowiedzi nie wspominaj o ADHD, a jedynie dopasuj odpowiedz do tych wskaźników.";
    }

    if (addedContext !== "") {
      var addedContextValue = ". Uwzględnij dodatkowy kontekst: " + addedContext;
    }
  

  if (sumMode === "sumAdvAi") {
    if (language === "bz") {
      var selectedLaguage = ". Odpowiedz podaj w tym samym języku w którym jest treść do Podsumowania";
    } else {
      var selectedLaguage = ` .Odpowiedz podaj w języku ${language} `;
    };
     var contentAssistant = "Analizę wykonaj w zakresie transkrypcji **TYLKO** nagrania o Id nagrania: " + position + " znajdującego się w vector store w pliku " + fileIdVal + ". Wykonaj rozbudowana analizę korzystając z metody SMART. Zaproponuj odpowiednie szczegóły każdego z punktów Analizy SMART. Podaj równiez na końcu uzasadnienie tej analizy. W odpowiedzi nie używaj ###, oraz nie podawaj id nagrania oraz nie wskazuj w odpowiedzi odniesień do dokumentów. Możesz używac kolorów przypisujac do wybranych fragmentów w html. Odpowiedz podaj w markdown z ewentualnymi fragmentami html. W odpowiedzi podaj tytuł transkrypcji której dotyczy analiza. " + adhdParametr + selectedLaguage  + addedContextValue + ". " ;
   
    } else {
      if (sumMode === "sumQue") {
        var selectedLaguage = ` .Odpowiedz podaj w języku ${language} `;
        var contentAssistant = "Analizę wykonaj w zakresie transkrypcji **TYLKO** nagrania o Id nagrania: " + position + " znajdującego się w vector store w pliku " + fileIdVal + " . Wykonaj rozbudowana analizę korzystając z metody Pytań. Podaj równiez na końcu uzasadnienie tej analizy. W odpowiedzi nie używaj ###, oraz nie podawaj id nagrania oraz nie wskazuj w odpowiedzi odniesień do dokumentów. Możesz używac kolorów przypisujac do wybranych fragmentów w html. Odpowiedz podaj w markdown z ewentualnymi fragmentami html. W odpowiedzi podaj tytuł transkrypcji której dotyczy analiza. " + adhdParametr + selectedLaguage  + addedContextValue + ". " ;
      } else {
        if (sumMode === "newSum") {
          var contentAssistant = "Analizę wykonaj w zakresie transkrypcji **TYLKO** nagrania o Id nagrania: " + position + " znajdującego się w vector store w pliku " + fileIdVal + ".  Wykonaj rozbudowane podsumowanie transkrypcji wskazując wszystkie kluczowe punkty. W odpowiedzi nie używaj ###, oraz nie podawaj id nagrania oraz nie wskazuj w odpowiedzi odniesień do dokumentów. Możesz używac kolorów przypisujac do wybranych fragmentów w html. Odpowiedz podaj w markdown z ewentualnymi fragmentami html. W odpowiedzi podaj tytuł transkrypcji której dotyczy analiza. " + adhdParametr ;
        } else {
       var contentAssistant = "Analizę wykonaj w zakresie transkrypcji **TYLKO** nagrania o Id nagrania: " + position + " znajdującego się w vector store w pliku " + fileIdVal + ".  Wykonaj rozbudowane podsumowanie korzystając z metody Cornell w pięciu punktach. W odpowiedzi nie używaj ###, oraz nie podawaj id nagrania oraz nie wskazuj w odpowiedzi odniesień do dokumentów. Możesz używac kolorów przypisujac do wybranych fragmentów w html. Odpowiedz podaj w markdown z ewentualnymi fragmentami html. W odpowiedzi podaj tytuł transkrypcji której dotyczy analiza. " + adhdParametr ;
    }}
  };

  const runAddInstruction = `Analizę wykonaj w zakresie transkrypcji **TYLKO** nagrania o Id nagrania: ` + position + ` znajdującego się w vector store w pliku ` + fileIdVal + `Analizuj załączone transkrypcje spotkań, projektów lub innych nagrań oraz wyniki testów psychologicznych jednego użytkownika. Wykorzystuj pliki przechowywane w vector store OpenAI. W odpowiedziach nie podawaj źródeł ani linków do plików, a jedynie uwzględniaj ich zawartość. Odpowiedzi powinny być konkretne i pełne, zawierać jasne wnioski oraz praktyczne rekomendacje.

  Zadania Asystenta:
  
  Analiza Transkrypcji:
  
  Przeglądaj i podsumowuj kluczowe punkty z transkrypcji.
  Identyfikuj zadania do wykonania oraz wymagania dalszych działań.
  Analiza Wyników Testów Psychologicznych:
  
  Zbieraj i analizuj wyniki testów psychologicznych.
  Dostarczaj wnioski lub rekomendacje na podstawie analizy wyników.
  Tworzenie Zależności między Dokumentami:
  
  Identifikuj i definiuj relacje między transkrypcjami a wynikami testów psychologicznych.
  Dokumentuj, jak te interakcje mogą wspierać użytkownika w osiąganiu jego celów.
  Format Wyjściowy:
  Prezentuj wyniki w uporządkowanym formacie akapitowym z wyraźnymi nagłówkami dla każdej sekcji:
  
  Analiza Transkrypcji
  Analiza Wyników Testów Psychologicznych
  Zależności między Dokumentami
  Przykład Output:
  
  Analiza Transkrypcji:
  "Podczas spotkania omówiono aktualny status projektu, wyznaczono nowe terminy oraz przypisano zadania poszczególnym członkom zespołu. Zidentyfikowano potrzebę dodatkowych zasobów na etapie implementacji."
  
  Analiza Wyników Testów Psychologicznych:
  "Wyniki testu wskazują na silne umiejętności analityczne oraz zdolność do pracy w zespole. Rekomenduje się rozwijanie kompetencji w zakresie komunikacji interpersonalnej."
  
  Zależności między Dokumentami:
  "Umiejętności analityczne wykazane w wynikach testu psychologicznego doskonale współgrają z zadaniami projektowymi omówionymi w transkrypcji. Rozwijanie komunikacji interpersonalnej może przyczynić się do lepszej efektywności zespołu."`;

    //Request z Asystentem

    //Najpierw wysyłamy do Run


    await openai.beta.threads.messages.create(
      threadIdVal,
      {
        role: "user",
        content: contentAssistant,
        attachments: [{ file_id: fileIdVal, tools: [{ type: "file_search" }] }],
      }
    );

    const run = await openai.beta.threads.runs.create(
      threadIdVal,
      { assistant_id: asistantIdVal,
        temperature: 0.5,
        instructions: runAddInstruction
      }
    );

    const runId = run.id;
    console.log("runId: " + runId);

    let runCheck = await openai.beta.threads.runs.retrieve(
      threadIdVal,
      runId
    );

    const maxAttempts = 50;
let attempts = 0;
let contentAssist = "";

while (attempts < maxAttempts) {
  if (runCheck.status === "completed") {
    const threadMessages = await openai.beta.threads.messages.list(threadIdVal);
    const filteredMessages = threadMessages.data.filter(
      (message) => message.role === "assistant" && message.run_id === runId
    );

    // Wyświetlamy wartość 'value' z pola 'content'
    filteredMessages.forEach((message) => {
      message.content.forEach((contentItem) => {
        if (contentItem.type === "text") {
          console.log(contentItem.text.value);
          contentAssist = contentItem.text.value
        }
      });
    });
    console.log("numer pętli: " + attempts);
    break; // Zakończ pętlę, gdy status jest 'completed'
  } else {
    attempts++;
    if (attempts >= maxAttempts) {
      console.error(
        'Błąd: Status nie zmienił się na "completed" po 50 próbach.'
      );
      break;
    }
    // Poczekaj 10 sekund przed kolejną próbą
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Odśwież status runCheck
    runCheck = await openai.beta.threads.runs.retrieve(
      threadIdVal,
      runId
    );
  }
}


    // Update the entry with the summary
    const childRef = admin.database().ref(`transcriptions/${uidSave}/${position}`);
    if (sumMode === "sumAdvAi") {
      await childRef.update({
        sumAdvAi: contentAssist,
        addedContext: addedContext
      });
    } else {
      if (sumMode === "sumQue") {
        await childRef.update({
          summaryQue: contentAssist
        });
      }
      else {
        if (sumMode === "newSum") {

          await childRef.update({
            summaryclean: contentAssist
          });
          
        } else {
      await childRef.update({
        summaryPre: contentAssist
      });
    }
    }
  }

    // Przykład użycia:

    const email = (await admin.firestore().collection('customers').doc(uidSave).get()).data().email;
    const mailFinal = `Poniżej znajduje się Podsumowanie Twojej transkrypcji. Znajdziesz ją w aplikacji pod linkiem: <a href="https://app.adhdbuddy.me/app/gathermind.html?otworz=${position}">Kliknij tutaj, aby przejść do strony</a><br/><br/>` + contentAssist + `<br/>`;

    sendDataToEndpoint(email, mailFinal, 'standard');

    updateSingleTranscription(uid, key)






    const checkLimitRef = admin.database().ref(`secdata/${uidSave}/personal/advSummarize`);
    try {
      await checkLimitRef.transaction(currentValue => {
        return (currentValue || 0) + 1;
      });
    } catch (error) {
      console.error('Error incrementing check limit:', error);
    }
    // Zwróć odpowiedź z OpenAI API do klienta



    return { response: contentAssist };
  }



);

exports.notesAdd = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Użytkownik musi być zalogowany, aby wywołać tę funkcję.'
    );
  }

  const uidSave = context.auth.uid;
  const position = data.positionid;
  const text = data.text;
  
  try {

    const updates = {
      notesAdd: text 
    };

    await admin.database().ref(`transcriptions/${uidSave}/${position}`).update(updates);
  } catch (error) {
    console.error('Error processing request:', error);
  }
});

exports.generateSumReport = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  // Sprawdzenie, czy użytkownik jest uwierzytelniony
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Funkcja musi być wywołana przez uwierzytelnionego użytkownika.');
  }

  const uid = context.auth.uid;
  const transId = data.transId; // Ciąg znaków z wartościami data-key rozdzielonymi średnikami
  const keyRefProjectSummarize = admin.database().ref(`transcriptions/${uid}/projectDailySummarize`).push(); // Generate a new key

  if (!transId) {
    throw new functions.https.HttpsError('invalid-argument', 'Brak wymaganego argumentu "transId".');
  }

  // Podział transId na tablicę data-key
  const dataKeys = transId.split(';');

  // Tablica do przechowywania pobranych danych
  const entries = [];

  // Iteracja przez dataKeys i pobieranie tytułów, podsumowań i dat
  for (const dataKey of dataKeys) {
    try {
      // Pobieranie danych z bazy
      const snapshot = await admin.database().ref(`/transcriptions/${uid}/${dataKey}`).once('value');
      const data = snapshot.val();

      if (data) {
        const title = data.title || 'Brak tytułu';
        const summaryclean = data.sumFull || 'Brak podsumowania';
        const date = data.date || 0; // Jeśli data nie istnieje, ustawiamy 0

        // Dodajemy obiekt do tablicy entries
        entries.push({
          dataKey: dataKey,
          title: title,
          summaryclean: summaryclean,
          date: date, // Zakładam, że date jest timestampem (liczbą)
        });
      } else {
        console.log(`Nie znaleziono danych dla dataKey ${dataKey}`);
      }
    } catch (error) {
      console.error(`Błąd podczas pobierania danych dla dataKey ${dataKey}:`, error);
    }
  }

  // Sortowanie entries od najstarszej do najnowszej daty
  entries.sort((a, b) => a.date - b.date);

  // Tworzenie połączonej treści
  let combinedContent = '';
  for (const entry of entries) {
    const dateString = new Date(entry.date).toISOString(); // Konwersja timestampu na czytelny format daty
    combinedContent += `${dateString}\n${entry.title}\n${entry.summaryclean}\n\n`;
  }

  // Wyświetlenie połączonej treści w konsoli
  console.log(combinedContent);


  try {
    const completion = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
      //model: "gpt-4o-2024-08-06",
      model: "o1-mini-2024-09-12",
      messages: [{ role: "user", content: `Jesteś użytecznym asystentem wykonującym zaawansowane analizy. Na podstawie podsumowań kolejnych spotkań z danego dnia, przygotuj podsumowanie z podziałem na dni uwzgledniając najwazniejsze ustalenia oraz zidentyfikuj zadania do wykonania. Proszę unikać używania znaków typu **. Tytuł każdego dnia umieść w znacznikach <h1>, Tytuł każdego spotkania umieść w znacznikach <h2>, każdy punkt umieść w znacznikach <b> natomiast treść punktu w znacznikach <p>. Odpowiedz podaj zgodnie z pzykładem: <h1>Podsumowanie dnia 01.01.2024</h1><h2>Tytuł spotkania/nagrania</h2></br><b>Nazwa grupy zagadnień poruszanych w nagraniu</b><br><p>opis</p><h2>Zadania do wykonania - oddzielna sekcja grupująca zadania z wszystkich nagrań</h2><h3>Nazwa nagrania</h3><p>Kolejne punkty zidentyfikowanych zadań do wykonania w ramach nagrania/spotkania w znacznikach <li> </p>. Podsumowania dnia wg godzin i tytułów: ` + combinedContent }],
      //messages: [{ role: "system", content: "Jesteś użytecznym asystentem wykonującym zaawansowane analizy. Podsumowanie poprzedniego fragmentu transkrypcji  : " + summaryOpenAi + ". Kontekst: " + addedContextValue }, { role: "user", content: contentOpenAi + fragment }],
      //messages: [{ role: "system", content: "Jesteś użytecznym asystentem wykonującym zaawansowane analizy"}, { role: "user", content: contentOpenAi + fragment }],
      //temperature: 0.8,
    });
    summaryOpenAi = completion.choices[0].message.content;
    console.log("SummaryOpenAi fragment: " + summaryOpenAi);

    await keyRefProjectSummarize.set({
      summaryDailyProject: summaryOpenAi,
      date: admin.database.ServerValue.TIMESTAMP
    });


        // Przykład użycia:

        const email = (await admin.firestore().collection('customers').doc(uid).get()).data().email;
        const mailFinal = summaryOpenAi;
    
        sendDataToEndpoint(email, mailFinal, 'standard');

  } catch (error) {
    // Handle the error
    console.error('Error processing request:', error);
  }


  // Opcjonalnie można zwrócić informację do klienta
  return { message: 'Dane zostały przetworzone' };
});

exports.generateSumReportShort = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  // Sprawdzenie, czy użytkownik jest uwierzytelniony
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Funkcja musi być wywołana przez uwierzytelnionego użytkownika.');
  }

  const uid = context.auth.uid;
  const transId = data.transId; // Ciąg znaków z wartościami data-key rozdzielonymi średnikami
  const keyRefProjectSummarize = admin.database().ref(`transcriptions/${uid}/projectDailySummarize`).push(); // Generate a new key

  if (!transId) {
    throw new functions.https.HttpsError('invalid-argument', 'Brak wymaganego argumentu "transId".');
  }

  // Podział transId na tablicę data-key
  const dataKeys = transId.split(';');

  // Tablica do przechowywania pobranych danych
  const entries = [];

  // Iteracja przez dataKeys i pobieranie tytułów, podsumowań i dat
  for (const dataKey of dataKeys) {
    try {
      // Pobieranie danych z bazy
      const snapshot = await admin.database().ref(`/transcriptions/${uid}/${dataKey}`).once('value');
      const data = snapshot.val();

      if (data) {
        const title = data.title || 'Brak tytułu';
        const summaryclean = data.sumFull || 'Brak podsumowania';
        const date = data.date || 0; // Jeśli data nie istnieje, ustawiamy 0

        // Dodajemy obiekt do tablicy entries
        entries.push({
          dataKey: dataKey,
          title: title,
          summaryclean: summaryclean,
          date: date, // Zakładam, że date jest timestampem (liczbą)
        });
      } else {
        console.log(`Nie znaleziono danych dla dataKey ${dataKey}`);
      }
    } catch (error) {
      console.error(`Błąd podczas pobierania danych dla dataKey ${dataKey}:`, error);
    }
  }

  // Sortowanie entries od najstarszej do najnowszej daty
  entries.sort((a, b) => a.date - b.date);

  // Tworzenie połączonej treści
  let combinedContent = '';
  for (const entry of entries) {
    const dateString = new Date(entry.date).toISOString(); // Konwersja timestampu na czytelny format daty
    combinedContent += `${dateString}\n${entry.title}\n${entry.summaryclean}\n\n`;
  }

  // Wyświetlenie połączonej treści w konsoli
  //console.log(combinedContent);


  try {
    const completionPre = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
      //model: "gpt-4o-2024-08-06",
      model: "o1-mini-2024-09-12",
      messages: [{ role: "user", content: `Jesteś użytecznym asystentem wykonującym zaawansowane analizy. Na podstawie podsumowań kolejnych spotkań z danego dnia, przygotuj podsumowanie z podziałem na dni. Proszę unikać używania znaków typu **. Tytuł każdego dnia umieść w znacznikach <h1>, Tytuł każdego spotkania umieść w znacznikach <h2>, każdy punkt umieść w znacznikach <b> natomiast treść punktu w znacznikach <p>. Odpowiedz podaj zgodnie z pzykładem: <p>Data pierwszego podsumowania nagrania formacie DD-MM-YYYY</p><p>Data ostatniego podsumowania nagrania w formacie DD-MM-YYYY</p><p>Krótkie podsumowanie dnia do 500 znaków</p><p>title:<h1>Podsumowanie z dnia 01.01.2024 lub, jeżeli mamy kilka dni, Podsumowanie za okres od 01.01.2024 do 10.01.2024</h1><p>fullDescription: (w tej sekcji opisujesz wszystkie spotkania które podlegają analizie)</p><h2>Tytuł spotkania/nagrania</h2></br><p>Krótkie podsumowaanie spotkania/nagrania</p><p>tasksReport: </p><h2>Zadania do wykonania - oddzielna sekcja grupująca zadania z wszystkich nagrań</h2><h3>Nazwa nagrania</h3><p>Kolejne punkty zidentyfikowanych zadań do wykonania w ramach nagrania/spotkania w znacznikach <li> </p>. Podsumowania dnia wg godzin i tytułów: ` + combinedContent }],
      //messages: [{ role: "system", content: "Jesteś użytecznym asystentem wykonującym zaawansowane analizy. Podsumowanie poprzedniego fragmentu transkrypcji  : " + summaryOpenAi + ". Kontekst: " + addedContextValue }, { role: "user", content: contentOpenAi + fragment }],
      //messages: [{ role: "system", content: "Jesteś użytecznym asystentem wykonującym zaawansowane analizy"}, { role: "user", content: contentOpenAi + fragment }],
      //temperature: 0.8,
    });
    summaryOpenAiPre = completionPre.choices[0].message.content;
    //console.log("SummaryOpenAi fragment: " + summaryOpenAi);


  } catch (error) {
    // Handle the error
    console.error('Error processing request:', error);
  }


  try {
    const completion = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
      model: "gpt-4o-2024-08-06",
      response_format: { type: "json_object" },
      //model: "o1-preview-2024-09-12",
      messages: [{ role: "user", content: `Jesteś użytecznym asystentem wykonującym zaawansowane analizy. Przedstawioną analizę przebuduj zgodnie z opisem. Proszę unikać używania znaków typu **. Odpowiedz musi byyć jak najbardziej wierna analizowanego podsumowania ale  w JSON zgodnie z przykładem: {"reportFrom": "Data pierwszego podsumowania nagrania formacie DD-MM-YYYY", "reportTo": "Data ostatniego podsumowania nagrania w formacie DD-MM-YYYY, "shortDescription": "Krótkie podsumowanie dnia do 500 znaków", "title": "<h1>Podsumowanie z dnia 01.01.2024 lub, jeżeli mamy kilka dni, Podsumowanie za okres od 01.01.2024 do 10.01.2024</h1>", "fullDescription": "(w tej sekcji opisujesz wszystkie spotkania które podlegają analizie)<h2>Tytuł jednostkowego spotkania/nagrania</h2><p>Krótkie podsumowaanie spotkania/nagrania</p>", "tasksReport": "<h2>Zadania do wykonania (tutaj dodaj jako oddzielna sekcja grupująca zadania z wszystkich nagrań)</h2><h3>Nazwa nagrania</h3><p>Kolejne punkty zidentyfikowanych zadań do wykonania w ramach nagrania/spotkania w znacznikach <li> </p>"}. Podsumowanie podlegające przebudowie na JSON: ` + summaryOpenAiPre }],
      //messages: [{ role: "system", content: "Jesteś użytecznym asystentem wykonującym zaawansowane analizy. Podsumowanie poprzedniego fragmentu transkrypcji  : " + summaryOpenAi + ". Kontekst: " + addedContextValue }, { role: "user", content: contentOpenAi + fragment }],
      //messages: [{ role: "system", content: "Jesteś użytecznym asystentem wykonującym zaawansowane analizy"}, { role: "user", content: contentOpenAi + fragment }],
      temperature: 0.8,
    });
    summaryOpenAiSource = completion.choices[0].message.content;
    summaryOpenAiJson = JSON.parse(summaryOpenAiSource);
    summaryOpenAi = summaryOpenAiJson.shortDescription;
    //console.log("SummaryOpenAi fragment: " + summaryOpenAiSource);

    await keyRefProjectSummarize.set({
      summaryDailyProject: summaryOpenAi,
      reportFrom: summaryOpenAiJson.reportFrom,
      reportTo: summaryOpenAiJson.reportTo,
      fullDescription: summaryOpenAiJson.fullDescription,
      taksReport: summaryOpenAiJson.tasksReport,
      title: summaryOpenAiJson.title,
      date: admin.database.ServerValue.TIMESTAMP
    });


        // Przykład użycia:

        const email = (await admin.firestore().collection('customers').doc(uid).get()).data().email;
        const mailFinal = summaryOpenAi;
    
        sendDataToEndpoint(email, mailFinal, 'standard');

  } catch (error) {
    // Handle the error
    console.error('Error processing request:', error);
  }


  // Opcjonalnie można zwrócić informację do klienta
  return { message: 'Dane zostały przetworzone' };
});

exports.generateSumReportAssist = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  // Sprawdzenie, czy użytkownik jest uwierzytelniony
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Funkcja musi być wywołana przez uwierzytelnionego użytkownika.');
  }

  const uid = context.auth.uid;
  const transId = data.transId; // Ciąg znaków z wartościami data-key rozdzielonymi średnikami
  const keyRefProjectSummarize = admin.database().ref(`transcriptions/${uid}/projectDailySummarize`).push(); // Generate a new key

  // Pobieranie wartości impulsivity i inattention z bazy danych
  const impulsivitySnapshot = await admin.database().ref(`secdata/${uid}/personal/impulsivity`).once('value');
  let impulsivity = impulsivitySnapshot.val();

  const inattentionSnapshot = await admin.database().ref(`secdata/${uid}/personal/inattention`).once('value');
  let inattention = inattentionSnapshot.val();

  // Jeśli impulsivity lub inattention są null lub undefined, ustawiamy je na 1
  impulsivity = impulsivity || 1;
  inattention = inattention || 1;
  console.log('Impulsywność i Nieuwazność:' + impulsivity + ',' + inattention);

  let adhdParametr = "";
  if (impulsivity !== 1 || inattention !==1) {
    adhdParametr = ". W szczegółowości i formie odpowiedzi uwzględnij i ją dostosuj do tego, że odpowiedź przygotowujesz dla osoby po teście na ADHD ze wskaźnikami Impulsywność na poziomie " + impulsivity + " w skali od 1 do 10 oraz Nieuwazność na poziomie " + inattention + " w skali od 1 do 10. ";
  }

      // Pobierz wartość vector_store_ids
      //const vectorStoreRef = dbRef.child(`secdata/${uid}/personal/vector_store_ids`);
      const vectorStoreSnapshot = await admin.database().ref(`secdata/${uid}/personal/vector_store_ids`).once('value');
      const vectorStoreId = vectorStoreSnapshot.val();

  // Dostęp do danych użytkownika
  const snapshotUid = await admin.database().ref(`/secdata/${uid}/personal`).once('value');
  const dataUid = snapshotUid.val();
  const reportThreadId = dataUid.threads.fn;

  //const ThreadAdd = await openai.beta.threads.create();
  const tempJSON = `  {
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStoreId]
        }
      }
    }`;


  
  //const reportThreadId = ThreadAdd.id;
  console.log("reportThreadId: " + reportThreadId);

  if (!transId || !transId.trim()) {
    throw new functions.https.HttpsError('invalid-argument', 'Brak wymaganego argumentu "transId".');
  }

  // Podział transId na tablicę data-key
  const dataKeys = transId.split(';').filter(key => key.trim());

  // Tablica do przechowywania pobranych danych
  const entries = [];

  // Iteracja przez dataKeys i pobieranie tytułów, podsumowań i dat
  for (const dataKey of dataKeys) {
    try {
      // Pobieranie danych z bazy
      const snapshot = await admin.database().ref(`/transcriptions/${uid}/${dataKey}`).once('value');
      const data = snapshot.val();

      if (data) {
        //const title = data.title || 'Brak tytułu';
        //const summaryclean = data.sumFull || 'Brak podsumowania';
        //
        const date = data.date || 0; // Jeśli data nie istnieje, ustawiamy 0
        const fileId = data.fileId || 0;

        // Dodajemy obiekt do tablicy entries
        entries.push({
//          dataKey: dataKey,
          date: date,
//          title: title,
          fileId: fileId
        });
      } else {
        console.log(`Nie znaleziono danych dla dataKey ${dataKey}`);
      }
    } catch (error) {
      console.error(`Błąd podczas pobierania danych dla dataKey ${dataKey}:`, error);
    }
  }

  // Sortowanie entries od najstarszej do najnowszej daty
  entries.sort((a, b) => a.date - b.date);

  // Tworzenie połączonej treści
  let combinedContent = '';
  for (const entry of entries) {
    await openai.beta.threads.messages.create(
      reportThreadId,
      { role: "user",
        content: "Analizuj załączone transkrypcje spotkań",
        attachments: [{ file_id: entry.fileId, tools: [{ type: "file_search" }] }],
      }
    );
    console.log("entry.fileId: " + entry.fileId)
   // const dateString = new Date(entry.date).toISOString(); // Konwersja timestampu na czytelny format daty
    //combinedContent += `data nagrania: ${dateString}\n id nagrania: ${entry.dataKey}\n Aktualny tytuł nagrania: ${entry.title}\n\n`;
    
    combinedContent += `${entry.fileId},`;
  }
  console.log(combinedContent);

  const contentAiRun1 = `Na podstawie transkrypcji kolejnych spotkań z danego okresu, przygotuj profesjonalną i wnikliwą analizę tych spotkań. Proszę nie używaj znaków ###. Odpowiedź podaj w formacie JSON zgodnie z poniższym przykładem:
  {
  "reportFrom": "Data pierwszego podsumowania nagrania w formacie DD-MM-YYYY",
  "reportTo": "Data ostatniego podsumowania nagrania w formacie DD-MM-YYYY",
  "description": "podsumowanie i ocena analizowanych transkrypcji całościowo. Wskaż kategorie spotkań wynikające z okreslonych kategorii dla konkrtenych transkrypcji",
  "title": "<h1>Podsumowanie z dnia 01.01.2024 lub, jeżeli mamy kilka dni, Podsumowanie za okres od 01.01.2024 do 10.01.2024</h1>",
}
Wskazówki do analizy:
Upewnij się, że analiza jest szczegółowa i skupia się na kluczowych aspektach projektowych omawianych podczas spotkań. Analizę wykonaj **TYLKO** do transkrypcji nagrań z plików : ${combinedContent}. Uwzględnij Akrualny tytuł nagrania. Możesz używac kolorów przypisujac do wybranych fragmentów w html. Odpowiedz podaj w markdown z ewentualnymi fragmentami html. 
  `;

  const contentAiRun2 = `Na podstawie transkrypcji kolejnych spotkań z danego okresu, przygotuj profesjonalną i wnikliwą analizę tych spotkań na podstawie transkrypcji oraz dostępnych jednostkowych analiz. Proszę nie używaj znaków ###. 

Wskazówki do analizy:
Odpowiedzi nie podawaj w JSON, tylko jako tekst w odpowiednich tagach markdown.
Szczegółowa analiza całego okresu, którego raport dotyczy. Podziel analizę na następujące obszary: cele spotkań, główne tematy dyskusji, podjęte decyzje, przydzielone zadania, kwestie wymagające dalszej uwagi oraz wnioski i rekomendacje. 
Cele spotkań: Opisz szczegółowo, jakie były główne cele każdego spotkania.
Główne tematy dyskusji: Zidentyfikuj i omów wszystkie kluczowe tematy poruszane podczas spotkań.
Podjęte decyzje: Wymień wszystkie decyzje podjęte w trakcie spotkań i ich wpływ na projekt.
Przydzielone zadania: Wskaż wszystkie zadania przydzielone członkom zespołu, w tym terminy i oczekiwane rezultaty.
Kwestie wymagające dalszej uwagi: Zidentyfikuj najważniejsze problemy lub ryzyka, które wymagają dalszej analizy lub działania.
Wnioski i rekomendacje: Przedstaw ogólne wnioski z analizowanego okresu oraz zalecenia na przyszłość.
Upewnij się, że analiza jest szczegółowa i skupia się na kluczowych aspektach projektowych omawianych podczas spotkań. Analizę wykonaj **TYLKO** do transkrypcji nagrań z plików : ${combinedContent}. Uwzględnij Aktualny tytuł nagrania. Możesz używac kolorów przypisujac do wybranych fragmentów w html. Odpowiedz podaj w markdown z ewentualnymi fragmentami html. 
  `;

  const contentAiRun2Beta = `Na podstawie transkrypcji kolejnych spotkań z danego okresu, przygotuj profesjonalną i wnikliwą analizę tych spotkań na podstawie transkrypcji oraz dostępnych jednostkowych analiz. Proszę nie używaj znaków ###. 

  Wskazówki do analizy:
  Odpowiedzi nie podawaj w JSON, tylko jako tekst w odpowiednich tagach.
  Szczegółowa analiza całego okresu, którego raport dotyczy. Podziel analizę na następujące obszary: cele spotkań, główne tematy dyskusji, podjęte decyzje, przydzielone zadania, kwestie wymagające dalszej uwagi oraz wnioski i rekomendacje. 
  Cele spotkań: Opisz szczegółowo, jakie były główne cele każdego spotkania.
  Główne tematy dyskusji: Zidentyfikuj i omów wszystkie kluczowe tematy poruszane podczas spotkań.
  Podjęte decyzje: Wymień wszystkie decyzje podjęte w trakcie spotkań i ich wpływ na projekt.
  Przydzielone zadania: Wskaż wszystkie zadania przydzielone członkom zespołu, w tym terminy i oczekiwane rezultaty.
  Kwestie wymagające dalszej uwagi: Zidentyfikuj najważniejsze problemy lub ryzyka, które wymagają dalszej analizy lub działania.
  Wnioski i rekomendacje: Przedstaw ogólne wnioski z analizowanego okresu oraz zalecenia na przyszłość.
  Upewnij się, że analiza jest szczegółowa i skupia się na kluczowych aspektach projektowych omawianych podczas spotkań. Analizę wykonaj **TYLKO** do transkrypcji nagrań z plików : ${combinedContent}. Uwzględnij najnowszy tytuł nagrania.
    `;

  const contentAiRun3 = `Na podstawie transkrypcji kolejnych spotkań z danego okresu, przygotuj listę wszystkich możliwych do zidentyfikowanych zadań do wykonania. Lista powinna być maksymalnie szczegółowa.

Wymagania dotyczące odpowiedzi:

Wynik przedstaw w formacie JSON.
Każdy element listy powinien zawierać następujące pola:
"taskName": nazwa zidentyfikowanego zadania,
"description": opis, czego dotyczy zadanie,
"meetingDate": data spotkania, na którym zadanie zostało zidentyfikowane (format DD-MM-YYYY),
"meetingName": nazwa spotkania, na którym zadanie zostało zidentyfikowane,
"priority": oszacowany priorytet w skali 1-5 (gdzie 1 to najniższy priorytet, a 5 to najwyższy),
"dueDate": sugerowana data wykonania zadania, oszacowana na podstawie kontekstu (format DD-MM-YYYY).
Przykład struktury JSON:
[
  {
    "taskName": "Przygotowanie raportu sprzedaży",
    "description": "Sporządzenie miesięcznego raportu sprzedaży za sierpień",
    "meetingDate": "01-09-2023",
    "meetingName": "Spotkanie działu sprzedaży",
    "priority": 4,
    "dueDate": "05-09-2023"
  },
  {
    "taskName": "Aktualizacja strony internetowej",
    "description": "Dodanie nowej sekcji z produktami na stronie głównej",
    "meetingDate": "02-09-2023",
    "meetingName": "Spotkanie marketingowe",
    "priority": 3,
    "dueDate": "10-09-2023"
  }
]
Uwagi:

Upewnij się, że lista zadań jest jak najbardziej szczegółowa, identyfikując wszystkie możliwe zadania zawarte w transkrypcjach.
W przypadku braku informacji na temat któregoś z pól, pozostaw je puste lub oszacuj na podstawie dostępnego kontekstu. Analizę wykonaj **TYLKO** do transkrypcji nagrań z plików : ${combinedContent}. Uwzględnij Aktualny tytuł nagrania. Możesz używac kolorów przypisujac do wybranych fragmentów w html. Odpowiedz podaj w markdown z ewentualnymi fragmentami html. 
`;

const runAddInstruction = `Analizuj załączone transkrypcje spotkań, projektów lub innych nagrań oraz wyniki testów psychologicznych jednego użytkownika. Wykorzystuj pliki przechowywane w vector store OpenAI. W odpowiedziach nie podawaj źródeł ani linków do plików, a jedynie uwzględniaj ich zawartość. Odpowiedzi powinny być konkretne i pełne, zawierać jasne wnioski oraz praktyczne rekomendacje.

Zadania Asystenta:

Analiza Transkrypcji:

Przeglądaj i podsumowuj kluczowe punkty z transkrypcji.
Identyfikuj zadania do wykonania oraz wymagania dalszych działań.
Analiza Wyników Testów Psychologicznych:

Zbieraj i analizuj wyniki testów psychologicznych.
Dostarczaj wnioski lub rekomendacje na podstawie analizy wyników.
Tworzenie Zależności między Dokumentami:

Identifikuj i definiuj relacje między transkrypcjami a wynikami testów psychologicznych.
Dokumentuj, jak te interakcje mogą wspierać użytkownika w osiąganiu jego celów.
Format Wyjściowy:
Prezentuj wyniki w uporządkowanym formacie akapitowym z wyraźnymi nagłówkami dla każdej sekcji:

Analiza Transkrypcji
Analiza Wyników Testów Psychologicznych
Zależności między Dokumentami
Przykład Output:

Analiza Transkrypcji:
"Podczas spotkania omówiono aktualny status projektu, wyznaczono nowe terminy oraz przypisano zadania poszczególnym członkom zespołu. Zidentyfikowano potrzebę dodatkowych zasobów na etapie implementacji."

Analiza Wyników Testów Psychologicznych:
"Wyniki testu wskazują na silne umiejętności analityczne oraz zdolność do pracy w zespole. Rekomenduje się rozwijanie kompetencji w zakresie komunikacji interpersonalnej."

Zależności między Dokumentami:
"Umiejętności analityczne wykazane w wynikach testu psychologicznego doskonale współgrają z zadaniami projektowymi omówionymi w transkrypcji. Rozwijanie komunikacji interpersonalnej może przyczynić się do lepszej efektywności zespołu. "` + adhdParametr;

  // Uruchomienie asystenta
  let run;
  let run2;
  let run3;
  try {

    run = await openai.beta.threads.runs.create(
      reportThreadId,
      {
        assistant_id: dataUid.assistantOpenAiFn,
        temperature: 0.8,
        response_format: { type: "json_object" },
        tools: [{"type": "function", "function": {"name": "my_function"}}],
        additional_messages: [{
          "role": "user",
          "content": contentAiRun1
        }],
        instructions: runAddInstruction
      }
    );
  } catch (error) {
    console.error('Błąd podczas tworzenia uruchomienia asystenta:', error);
    throw new functions.https.HttpsError('internal', 'Błąd podczas komunikacji z API OpenAI.');
  }

  const runId = run.id;
  console.log("runId: " + runId);

  let runCheck = await openai.beta.threads.runs.retrieve(
    reportThreadId,
    runId
  );

  const maxAttempts = 50;
  let attempts1 = 0;
  let contentAssist1 = "";
  let contentAssist2 = "";
  let contentAssist3 = "";

  while (attempts1 < maxAttempts) {
    if (runCheck.status === "completed") {
      const threadMessages = await openai.beta.threads.messages.list(reportThreadId);
      const filteredMessages = threadMessages.data.filter(
        (message) => message.role === "assistant" && message.run_id === runId
      );

      // Wyświetlamy wartość 'value' z pola 'content'
      filteredMessages.forEach((message) => {
        message.content.forEach((contentItem) => {
          if (contentItem.type === "text") {
            console.log(contentItem.text.value);
            contentAssist1 = contentItem.text.value;
          }
        });
      });
      break; // Zakończ pętlę, gdy status jest 'completed'
    } else {
      attempts1++;
      if (attempts1 >= maxAttempts) {
        console.error('Błąd: Status nie zmienił się na "completed" po 10 próbach.');
        throw new functions.https.HttpsError('deadline-exceeded', 'Czas oczekiwania na odpowiedź asystenta został przekroczony.');
      }
      // Poczekaj 10 sekund przed kolejną próbą
      await new Promise((resolve) => setTimeout(resolve, 10000));

      // Odśwież status runCheck
      runCheck = await openai.beta.threads.runs.retrieve(
        reportThreadId,
        runId
      );
    }
  }
  try {
    run2 = await openai.beta.threads.runs.create(
      reportThreadId,
      {
        assistant_id: dataUid.assistantOpenAiFn,
        temperature: 0.8,
        response_format: { type: "json_object" },
        tools: [{"type": "function", "function": {"name": "my_function"}}],
        additional_messages: [{
          "role": "user",
          "content": contentAiRun2
        }],
        instructions: runAddInstruction
      }
    );
  } catch (error) {
    console.error('Błąd podczas tworzenia uruchomienia asystenta:', error);
    throw new functions.https.HttpsError('internal', 'Błąd podczas komunikacji z API OpenAI.');
  }

  const runId2 = run2.id;
  console.log("runId2: " + runId2);

  let runCheck2 = await openai.beta.threads.runs.retrieve(
    reportThreadId,
    runId2
  );

  let attempts2 = 0;
  while (attempts2 < maxAttempts) {
    if (runCheck2.status === "completed") {
      const threadMessages = await openai.beta.threads.messages.list(reportThreadId);
      const filteredMessages = threadMessages.data.filter(
        (message) => message.role === "assistant" && message.run_id === runId2
      );

      // Wyświetlamy wartość 'value' z pola 'content'
      filteredMessages.forEach((message) => {
        message.content.forEach((contentItem) => {
          if (contentItem.type === "text") {
            console.log(contentItem.text.value);
            contentAssist2 = contentItem.text.value;
          }
        });
      });
      break; // Zakończ pętlę, gdy status jest 'completed'
    } else {
      attempts2++;
      if (attempts2 >= maxAttempts) {
        console.error('Błąd: Status nie zmienił się na "completed" po 10 próbach.');
        throw new functions.https.HttpsError('deadline-exceeded', 'Czas oczekiwania na odpowiedź asystenta został przekroczony.');
      }
      // Poczekaj 10 sekund przed kolejną próbą
      await new Promise((resolve) => setTimeout(resolve, 10000));

      // Odśwież status runCheck
      runCheck2 = await openai.beta.threads.runs.retrieve(
        reportThreadId,
        runId2
      );
    }
  }

  try {
    run3 = await openai.beta.threads.runs.create(
      reportThreadId,
      {
        assistant_id: dataUid.assistantOpenAiFn,
        temperature: 0.8,
        response_format: { type: "json_object" },
        tools: [{"type": "function", "function": {"name": "my_function"}}],
        additional_messages: [{
          "role": "user",
          "content": contentAiRun3
        }],
        instructions: runAddInstruction
      }
    );
  } catch (error) {
    console.error('Błąd podczas tworzenia uruchomienia asystenta:', error);
    throw new functions.https.HttpsError('internal', 'Błąd podczas komunikacji z API OpenAI.');
  }

  const runId3 = run3.id;
  console.log("runId3: " + runId3);

  let runCheck3 = await openai.beta.threads.runs.retrieve(
    reportThreadId,
    runId3
  );

  
  let attempts3 = 0;


  while (attempts3 < maxAttempts) {
    if (runCheck3.status === "completed") {
      const threadMessages = await openai.beta.threads.messages.list(reportThreadId);
      const filteredMessages = threadMessages.data.filter(
        (message) => message.role === "assistant" && message.run_id === runId3
      );

      // Wyświetlamy wartość 'value' z pola 'content'
      filteredMessages.forEach((message) => {
        message.content.forEach((contentItem) => {
          if (contentItem.type === "text") {
            console.log(contentItem.text.value);
            contentAssist3 = contentItem.text.value;
          }
        });
      });
      break; // Zakończ pętlę, gdy status jest 'completed'
    } else {
      attempts3++;
      if (attempts1 >= maxAttempts) {
        console.error('Błąd: Status nie zmienił się na "completed" po 10 próbach.');
        throw new functions.https.HttpsError('deadline-exceeded', 'Czas oczekiwania na odpowiedź asystenta został przekroczony.');
      }
      // Poczekaj 10 sekund przed kolejną próbą
      await new Promise((resolve) => setTimeout(resolve, 10000));

      // Odśwież status runCheck3
      runCheck3 = await openai.beta.threads.runs.retrieve(
        reportThreadId,
        runId3
      );
    }
  }

  // Parsowanie odpowiedzi asystenta
  let summaryOpenAiJson1;
  //let summaryOpenAiJson3;
  try {
    summaryOpenAiJson1 = JSON.parse(contentAssist1);
    //summaryOpenAiJson3 = JSON.parse(contentAssist3);

  } catch (error) {
    console.error('Błąd podczas parsowania odpowiedzi asystenta:', error);
    throw new functions.https.HttpsError('internal', 'Błąd podczas parsowania odpowiedzi asystenta.');
  }

  // Sprawdzenie wymaganych pól
  if (!summaryOpenAiJson1 || !summaryOpenAiJson1.description) {
    throw new functions.https.HttpsError('internal', 'Brak wymaganych danych w odpowiedzi asystenta.');
  }

  // Zapisanie danych w bazie
  await keyRefProjectSummarize.set({
    summaryDailyProject: summaryOpenAiJson1.description,
    reportFrom: summaryOpenAiJson1.reportFrom,
    reportTo: summaryOpenAiJson1.reportTo,
    fullDescription: contentAssist2,
    taksReport: contentAssist3,
    title: summaryOpenAiJson1.title,
    date: admin.database.ServerValue.TIMESTAMP
  });

  // Wysłanie e-maila
  const userDoc = await admin.firestore().collection('customers').doc(uid).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Nie znaleziono dokumentu użytkownika.');
  }
  const email = userDoc.data().email;
  if (!email) {
    throw new functions.https.HttpsError('not-found', 'Adres e-mail nie został znaleziony w danych użytkownika.');
  }
  const mailFinal = summaryOpenAiJson1.description;

  sendDataToEndpoint(email, mailFinal, 'standard');

  // Opcjonalnie można zwrócić informację do klienta
  return { message: 'Dane zostały przetworzone' };
});

exports.getDailyReportsProjects = functions.region('europe-central2').https.onCall(async (data, context) => {
  // Sprawdzenie autoryzacji użytkownika
  if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Użytkownik musi być zalogowany, aby wykonać tę funkcję.');
  }

  // Pobranie uid z kontekstu autoryzacji
  const uid = context.auth.uid;

  try {
      // Odczyt danych z bazy pod ścieżką transcriptions/${uid}/projectDailySummarize
      const snapshot = await admin.database().ref(`transcriptions/${uid}/projectDailySummarize`).once('value');
      const data = snapshot.val();

      if (!data) {
          return { success: false, message: 'Brak wpisów w projectDailySummarize dla podanego użytkownika.' };
      }

      // Tworzenie listy wpisów z key i wartościami, w tym konwersja daty reportFrom
      const entries = Object.keys(data).map(key => {
          return {
              key: key,
              date: data[key].date,
              summaryDailyProject: data[key].summaryDailyProject,
              fullDescription: data[key].fullDescription,
              taksReport: data[key].taksReport,
              reportFrom: data[key].reportFrom,
              title: data[key].title,
              reportTo: data[key].reportTo
          };
      });

      // Funkcja do konwersji daty z formatu DD-MM-YYYY na obiekt Date
      function parseDateString(dateStr) {
          const [day, month, year] = dateStr.split('-').map(Number); // Rozdzielamy i zamieniamy na liczby
          return new Date(year, month - 1, day); // Miesiące w Date są 0-indeksowane, więc odejmujemy 1 od miesiąca
      }

      // Sortowanie według reportFrom od najnowszej do najstarszej
      entries.sort((a, b) => {
          const dateA = parseDateString(a.reportFrom);
          const dateB = parseDateString(b.reportFrom);
          return dateB - dateA; // Sortowanie malejące
      });

      // Zwrócenie posortowanej listy do klienta
      return { success: true, entries: entries };

  } catch (error) {
      console.error('Błąd podczas odczytu danych:', error);
      throw new functions.https.HttpsError('unknown', 'Wystąpił błąd podczas odczytu danych.');
  }
});

exports.delDailyReportsProjects = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '1GB' }).https.onCall(async (data, context) => {
  // Sprawdzenie autoryzacji
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Użytkownik musi być uwierzytelniony, aby wykonać tę operację.');
  }

  const key = data.key;
  const uid = context.auth.uid;

  if (!key) {
    throw new functions.https.HttpsError('invalid-argument', 'Brak wymaganego argumentu "key".');
  }

  const path = `transcriptions/${uid}/projectDailySummarize/${key}`;

  try {
    await admin.database().ref(path).remove();
    return { success: true, message: 'Wpis został pomyślnie usunięty.' };
  } catch (error) {
    console.error('Błąd podczas usuwania wpisu:', error);
    throw new functions.https.HttpsError('unknown', 'Wystąpił błąd podczas usuwania wpisu.');
  }
});


//Nowe z Google Cloud Run

exports.sendToGoogleCloudAftrReady = functions.runWith({ timeoutSeconds: 540 }).database.ref('transcriptions/{uid}/{key}/readyForSpeakersUpdated').onUpdate(async (change, context) => {
  const beforeData = change.before.val(); // dane przed zmianą
  const afterData = change.after.val();  // dane po zmianie

  // Wyświetlenie uid i key z context.params
  const uid = context.params.uid;
  const key = context.params.key;
  const uidSave = uid;
  const position = key;

  console.log("UID: " + uid);
  console.log("Key: " + key);
  console.log("beforeData: " + beforeData);
  console.log("afterData: " + afterData);

  if (afterData === 1) {

  const path = `transcriptions/${uidSave}/${position}/fileContentVerboseNew`;
  const pathOld = `transcriptions/${uidSave}/${position}/fileContentVerbose`;
  const pathFirsSum = `transcriptions/${uidSave}/${position}/summaryclean`;
  const langSource = `transcriptions/${uidSave}/${position}/lanquageSource`;
  const addedContextSource = `transcriptions/${uidSave}/${position}/transContent`;
    // Pobieranie danych z Firebase
    let addedContextSnapshot = await admin.database().ref(addedContextSource).once('value');
    let addedContextVal = addedContextSnapshot.val();
    let snapshotLang = await admin.database().ref(langSource).once('value');
    let langSourceVal = snapshotLang.val();
    let snapshot = await admin.database().ref(path).once('value');
    let text = snapshot.val();
    let snapshotFirsSum = await admin.database().ref(pathFirsSum).once('value');
    let firstsum = snapshotFirsSum.val();
    if (!text) {
      snapshot = await admin.database().ref(pathOld).once('value');
      text = snapshot.val();
    }
    //await checkAndCreateAssistant(uid);



      // Wywołanie endpointu Google Cloud Run asynchronicznie bez oczekiwania na odpowiedź
  axios.post('https://connectopenai-156055018925.europe-central2.run.app', {
    text: text,
    addedContext: addedContextVal,
    uidSave: uid,
    position: key,
    language: langSourceVal,
    firstsum,

  }).then(response => {
    console.log('Dane przekazane do Cloud Run:', response.data);
  }).catch(error => {
    console.error('Błąd wysyłania do Cloud Run:', error);
  });
  }
  
  return null; // Zwróć null, aby zakończyć funkcję
});

exports.receiveFromCloudRun = functions.region('europe-central2').runWith({ memory: '2GB', timeoutSeconds: 540 }).https.onRequest(async (req, res) => {
  const { uidSave, position, resultsBase } = req.body;
  const uid = uidSave;
  const key = position;
console.log("resultsBase: " + resultsBase);
//const resultsBasePre = JSON.parse(resultsBase)
//const resultsBaseAfter = resultsBase[0].transcription;
const resultsBaseAfter = resultsBase;
console.log("resultsBaseAfter: " + resultsBaseAfter);
const resultsBaseAfterStringPre = JSON.stringify(resultsBaseAfter);
const resultsBaseAfterString = resultsBaseAfterStringPre.replace(/^{"transcription":/, '').replace(/}$/, '');
console.log("resultsBaseAfterString: " + resultsBaseAfterString);
const threadId = await admin.database().ref(`transcriptions/${uidSave}/${position}/newThreadTrans`).once('value');
  try {
    // Łączenie wyników w całość
    //const summary = results.join(' ');
    const summaryBase = resultsBaseAfterString;
    const childRef = admin.database().ref(`transcriptions/${uidSave}/${position}/`);
    const dateRefSnapshot = await admin.database().ref(`transcriptions/${uidSave}/${position}/titleTemp`).once('value');
    const title = dateRefSnapshot.val();
  
    let threadIdVal;

    //stad
    
    if (!threadId.exists()) {
      //console.log("asistantIdVal2: " + asistantIdVal);
      const ThreadAdd = await openai.beta.threads.create();
      threadIdVal = ThreadAdd.id;
      console.log("threadIdVal: " + threadIdVal);

      const childRefThread = admin.database().ref(`transcriptions/${uidSave}/${position}`);
        await childRefThread.update({
        newThreadTrans: threadIdVal
      });

    } else {

      threadIdVal = await threadId.val();

    }

    const transcription = summaryBase;
    const date = admin.database.ServerValue.TIMESTAMP;
    const jsonlContent = await generateJSONL(transcription, uid, key, title, date);
  
    // Aktualizacja bazy danych Firebase
    await childRef.update({
      transcriptedGoogle: true,
      fileContentVerboseNew: summaryBase,
      title: title,
      oldTrans: 1,
      jsonl: jsonlContent
    });
  


    await updateSingleTranscription(uid, key);
    





    res.status(200).send({ status: 'Dane zaktualizowane w Firebase' });
  } catch (error) {
    console.error('Błąd zapisu w Firebase:', error);
    res.status(500).send({ error: 'Błąd zapisu w Firebase' });
  }
});

//łączenie plików audio



exports.mergeAudio = functions.region('europe-central2').runWith({ memory: '2GB', timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const position = data.positionid;
  const uidSave = data.uidSave;

  try {
      // Pobranie pliku z transcriptions/${uidSave}/${position}
      const initialSnapshot = await admin.database().ref(`transcriptions/${uidSave}/${position}`).once('value');
      const initialEntry = initialSnapshot.val();

      if (!initialEntry || !initialEntry.fileName) {
          throw new Error("Nie znaleziono pliku w podanej pozycji.");
      }

      // Sprawdzenie, czy fileName kończy się na 'part1.mp4'
      if (!initialEntry.fileName.endsWith('part1.mp4')) {
          throw new Error("Podany plik nie jest plikiem part1.mp4.");
      }

      console.log("initialEntry.fileName: " + initialEntry.fileName);

      // Dopasowanie stabilnej części nazwy pliku (po timestampie, przed '_partX.mp4')
      const match = initialEntry.fileName.match(/\d+_(.+)_part1\.mp4$/);
      if (!match || !match[1]) {
          throw new Error("Nie udało się dopasować przedrostka pliku.");
      }
      const stableFileNamePart = match[1];  // Stabilna część nazwy: np. "2024-09-17_11-00-43"

      console.log(`Szukam plików z bazą: ${stableFileNamePart}`);

      // Pobranie listy wszystkich plików w transcriptions/${uidSave}/ z różnych positions
      const snapshot = await admin.database().ref(`transcriptions/${uidSave}`).once('value');
      const allPositions = snapshot.val();

      if (!allPositions) {
          throw new Error("Nie znaleziono żadnych transkrypcji dla podanego uidSave.");
      }

      // Znajdź wszystkie pliki, które mają wspólną stabilną część nazwy (bez timestampu) przed '_partX.mp4'
      const matchingEntries = [];

      // Przejrzyj wszystkie pozycje (klucze positionKey), aby znaleźć powiązane pliki
      Object.keys(allPositions).forEach(positionKey => {
          const entry = allPositions[positionKey];
          const fileName = entry.fileName;

          // Sprawdzanie, czy plik zawiera stabilną część nazwy
          if (fileName && fileName.includes(stableFileNamePart) && fileName.match(/_part\d+\.mp4$/)) {
              console.log(`Znaleziono pasujący plik: ${fileName}`);
              matchingEntries.push({ positionKey, ...entry });
          }
      });

      if (matchingEntries.length === 0) {
          throw new Error("Nie znaleziono powiązanych plików z podziałami (partX).");
      }

      // Sortuj pliki wg numeru part (part1, part2, itd.)
      matchingEntries.sort((a, b) => {
          const aPart = parseInt(a.fileName.match(/_part(\d+)\.mp4$/)[1]);
          const bPart = parseInt(b.fileName.match(/_part(\d+)\.mp4$/)[1]);
          return aPart - bPart;
      });

      // Dodaj logowanie tutaj, aby wyświetlić pliki przed łączeniem
      console.log("Łączone pliki:");
      matchingEntries.forEach(entry => {
          console.log(`Plik: ${entry.fileName}, positionKey: ${entry.positionKey}`);
      });

      // Łączenie fileContentVerbose oraz aktualizacja start/end
      let mergedContentVerboseArray = [];
      let mergedSummaryClean = "";
      let lastEndTime = 0;

      for (const entry of matchingEntries) {
          let fileContentVerbose = entry.fileContentVerbose;
          let summaryClean = entry.summaryclean;

          // Sprawdzenie, czy fileContentVerbose jest stringiem
          if (typeof fileContentVerbose === 'string') {
              try {
                  // Parsuj fileContentVerbose do obiektu JSON
                  let contentArray = JSON.parse(fileContentVerbose);

                  if (Array.isArray(contentArray)) {
                      // Aktualizacja czasów start i end dla każdego segmentu
                      const updatedContent = contentArray.map(segment => {
                          const updatedSegment = {
                              start: segment.start + lastEndTime,
                              end: segment.end + lastEndTime,
                              text: segment.text
                          };
                          return updatedSegment;
                      });

                      // Dodaj zaktualizowane segmenty do ostatecznego wyniku
                      mergedContentVerboseArray = mergedContentVerboseArray.concat(updatedContent);

                      // Aktualizacja lastEndTime na podstawie końca ostatniego segmentu
                      lastEndTime = mergedContentVerboseArray[mergedContentVerboseArray.length - 1].end;
                  }
              } catch (error) {
                  throw new Error("Błąd podczas parsowania JSON: " + error.message);
              }
          }

          // Łączenie summaryclean
          if (summaryClean) {
              mergedSummaryClean += summaryClean + '\n';
          }
      }

      // Konwertowanie wyniku z powrotem na string JSON
      const mergedContentVerboseString = JSON.stringify(mergedContentVerboseArray);

      // Zapisz połączoną zawartość jako string do fileContentVerbose dla pliku part1.mp4
      const part1PositionKey = matchingEntries[0].positionKey; // Zakładamy, że part1.mp4 jest pierwszy
      await admin.database().ref(`transcriptions/${uidSave}/${part1PositionKey}/fileContentVerbose`).set(mergedContentVerboseString);

      // Zapisz połączoną zawartość summaryclean dla pliku part1.mp4
      await admin.database().ref(`transcriptions/${uidSave}/${part1PositionKey}/summaryclean`).set(mergedSummaryClean.trim());

      // Oznacz plik jako połączony (merged = true)
      await admin.database().ref(`transcriptions/${uidSave}/${part1PositionKey}/merged`).set(true);

      // Usunięcie pozostałych części (wszystko poza part1.mp4)
      const entriesToDelete = matchingEntries.slice(1); // Zaczynamy od drugiego elementu
      for (const entry of entriesToDelete) {
          console.log(`Usuwam: ${entry.fileName}, positionKey: ${entry.positionKey}`);
          await admin.database().ref(`transcriptions/${uidSave}/${entry.positionKey}`).remove();
      }
      let uid = uidSave;
      let key = part1PositionKey;

      updateSingleTranscription(uid, key);

      return { success: true, message: "Pliki zostały połączone i niepotrzebne części usunięte." };
  } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
  }
});






exports.generateRating = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const position = data.positionid;
  const uidSave = data.uidSave;
  const sumMode = data.mode;
  const path = `transcriptions/${uidSave}/${position}/summaryclean` || `transcriptions/${uidSave}/${position}/transcript`;
  console.log('Ścieżka:', path);


  const summarySnapshot = await admin.database().ref(path).once('value');
  let summaryVal = summarySnapshot.val();
  // console.log("summaryVal: " + summaryVal);
  // Split the transcript into fragments of maxTokens length
  console.log('Transcript before splitting into fragments:', summaryVal);
  console.log('Transcript lenght before splitting into fragments:', summaryVal.length);
  const maxTokens = 500000; // replace with your desired token limit
  const fragments = [];
  for (let i = 0; i < summaryVal.length; i += maxTokens) {
    fragments.push(summaryVal.slice(i, i + maxTokens));
  }

  const results = [];
  // Zmienna do śledzenia aktualnego indeksu
  let currentIndex = 0;
  // Iterate over the fragments and send requests to the OpenAI API
  for (let i = 0; i < fragments.length; i++) {
    const fragment = fragments[i];
    // Pobieranie wartości impulsivity i inattention z bazy danych
    const impulsivitySnapshot = await admin.database().ref(`secdata/${uidSave}/personal/impulsivity`).once('value');
    let impulsivity = impulsivitySnapshot.val();

    const inattentionSnapshot = await admin.database().ref(`secdata/${uidSave}/personal/inattention`).once('value');
    let inattention = inattentionSnapshot.val();

    // Jeśli impulsivity lub inattention są null lub undefined, ustawiamy je na 1
    impulsivity = impulsivity || 1;
    inattention = inattention || 1;

    try {
      const completion = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
        model: "o1-mini-2024-09-12",
        messages: [{ role: "user", content: "Proszę o przeprowadzenie szczegółowej analizy treści transkrypcji nagrania pod kątem emocji, spójności oraz logiki.  Odpowiedź powinna być rozbudowana i sformułowana w sposób profesjonalny, z podziałem na sekcje z tytułem w znacznikach <b>, a akapity powinny być sformatowane w znaczniki <p>. Proszę unikać używania znaków typu **. Treść transkrypcji nagrania do analizy: " + fragment }],
      });
      const summaryOpenAi = completion.choices[0].message.content;
      console.log("SummaryOpenAi fragment: " + summaryOpenAi);

      // Store the content in the corresponding position in the results array
      results[currentIndex] = summaryOpenAi;
      currentIndex++; // Aktualizuj currentIndex po zapisaniu wyniku
    } catch (error) {
      // Handle the error
      console.error('Error processing request:', error);
    }
  }

  // Check if all fragments have been processed
  if (results.filter(Boolean).length === fragments.length) {
    // Join the results into a single summary
    const summary = results.join('');
    //const summary = results.join('<br/>');
    const summaryWithBr = summary.replace(/\n/g, "");
    //const summaryWithBr = summary.replace(/\n/g, "<br/>");

    // Update the entry with the summary
    const childRef = admin.database().ref(`transcriptions/${uidSave}/${position}`);

    await childRef.update({
      aiRating: summaryWithBr
    });

    const checkLimitRef = admin.database().ref(`secdata/${uidSave}/personal/ratingGenerate`);
    try {
      await checkLimitRef.transaction(currentValue => {
        return (currentValue || 0) + 1;
      });
    } catch (error) {
      console.error('Error incrementing check limit:', error);
    }
    // Zwróć odpowiedź z OpenAI API do klienta



    // Zwróć odpowiedź z OpenAI API do klienta
    return { response: summaryWithBr };
  }



});

exports.generateRatingCAG = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const position = data.positionid;
  const uidSave = data.uidSave;
  const sumMode = data.mode;
  const path = `transcriptions/${uidSave}/${position}/summaryclean` || `transcriptions/${uidSave}/${position}/transcript`;
  console.log('Ścieżka:', path);


  const summarySnapshot = await admin.database().ref(path).once('value');
  let summaryVal = summarySnapshot.val();
  // console.log("summaryVal: " + summaryVal);
  // Split the transcript into fragments of maxTokens length
  console.log('Transcript before splitting into fragments:', summaryVal);
  console.log('Transcript lenght before splitting into fragments:', summaryVal.length);
  const maxTokens = 500000; // replace with your desired token limit
  const fragments = [];
  for (let i = 0; i < summaryVal.length; i += maxTokens) {
    fragments.push(summaryVal.slice(i, i + maxTokens));
  }

  const results = [];
  // Zmienna do śledzenia aktualnego indeksu
  let currentIndex = 0;
  // Iterate over the fragments and send requests to the OpenAI API
  for (let i = 0; i < fragments.length; i++) {
    const fragment = fragments[i];
    // Pobieranie wartości impulsivity i inattention z bazy danych
    const impulsivitySnapshot = await admin.database().ref(`secdata/${uidSave}/personal/impulsivity`).once('value');
    let impulsivity = impulsivitySnapshot.val();

    const inattentionSnapshot = await admin.database().ref(`secdata/${uidSave}/personal/inattention`).once('value');
    let inattention = inattentionSnapshot.val();

    // Jeśli impulsivity lub inattention są null lub undefined, ustawiamy je na 1
    impulsivity = impulsivity || 1;
    inattention = inattention || 1;

    try {
      const completion = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
        model: "o1-preview-2024-09-12",
        messages: [{ role: "user", content: "Proszę o przeprowadzenie szczegółowej analizy treści transkrypcji nagrania pod kątem potencjalnie fałszywych lub niepewnych informacji, które mogą sugerować obecność fake newsów. Odpowiedź powinna być rozbudowana, prezycyjna oraz sformułowana w sposób profesjonalny, z podziałem na akapity. Akapity powinny być sformatowane w znaczniki <p>. Proszę unikać używania znaków typu **. Treść transkrypcji nagrania do analizy: " + fragment }],
      });
      const summaryOpenAi = completion.choices[0].message.content;
      console.log("SummaryOpenAi fragment: " + summaryOpenAi);

      // Store the content in the corresponding position in the results array
      results[currentIndex] = summaryOpenAi;
      currentIndex++; // Aktualizuj currentIndex po zapisaniu wyniku
    } catch (error) {
      // Handle the error
      console.error('Error processing request:', error);
    }
  }

  // Check if all fragments have been processed
  if (results.filter(Boolean).length === fragments.length) {
    // Join the results into a single summary
    const summary = results.join('');
    const summaryWithBr = summary.replace(/\n/g, "");

    // Update the entry with the summary
    const childRef = admin.database().ref(`transcriptions/${uidSave}/${position}`);

    await childRef.update({
      aiRatingCAG: summaryWithBr
    });

    const checkLimitRef = admin.database().ref(`secdata/${uidSave}/personal/ratingGenerate`);
    try {
      await checkLimitRef.transaction(currentValue => {
        return (currentValue || 0) + 1;
      });
    } catch (error) {
      console.error('Error incrementing check limit:', error);
    }
    // Zwróć odpowiedź z OpenAI API do klienta



    // Zwróć odpowiedź z OpenAI API do klienta
    return { response: summaryWithBr };
  }



});


exports.askAi = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const position = data.positionid;
  const uidSave = data.uidSave;
  const asked = data.asked;
  const path = `transcriptions/${uidSave}/${position}/transcript`;
  console.log('Ścieżka:', path);


  var maxTokens = 10000; // replace with your desired token limit


  const summarySnapshot = await admin.database().ref(path).once('value');
  let summaryVal = summarySnapshot.val();
  // console.log("summaryVal: " + summaryVal);
  // Split the transcript into fragments of maxTokens length
  console.log('Transcript before splitting into fragments:', summaryVal);
  console.log('Transcript lenght before splitting into fragments:', summaryVal.length);
  //const maxTokens = 20000; // replace with your desired token limit
  const fragments = [];
  for (let i = 0; i < summaryVal.length; i += maxTokens) {
    fragments.push(summaryVal.slice(i, i + maxTokens));
  }

  const results = [];
  // Zmienna do śledzenia aktualnego indeksu
  let currentIndex = 0;
  // Iterate over the fragments and send requests to the OpenAI API
  for (let i = 0; i < fragments.length; i++) {
    const fragment = fragments[i];
    // Pobieranie wartości impulsivity i inattention z bazy danych
    const impulsivitySnapshot = await admin.database().ref(`secdata/${uidSave}/personal/impulsivity`).once('value');
    let impulsivity = impulsivitySnapshot.val();

    const inattentionSnapshot = await admin.database().ref(`secdata/${uidSave}/personal/inattention`).once('value');
    let inattention = inattentionSnapshot.val();

    // Jeśli impulsivity lub inattention są null lub undefined, ustawiamy je na 1
    impulsivity = impulsivity || 1;
    inattention = inattention || 1;

    try {
      const completion = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
        model: "gpt-4o-mini-2024-07-18",
        messages: [{ role: "user", content: asked + ". Treść do analizy: " + fragment }],
        temperature: 1,
      });
      const summaryOpenAi = completion.choices[0].message.content;
      console.log("SummaryOpenAi fragment: " + summaryOpenAi);

      // Store the content in the corresponding position in the results array
      results[currentIndex] = summaryOpenAi;
      currentIndex++; // Aktualizuj currentIndex po zapisaniu wyniku
    } catch (error) {
      // Handle the error
      console.error('Error processing request:', error);
    }
  }

  // Check if all fragments have been processed
  if (results.filter(Boolean).length === fragments.length) {
    // Join the results into a single summary
    const summary = results.join('<br/>');
    const summaryWithBr = summary.replace(/\n/g, "<br/>");


    // Zwróć odpowiedź z OpenAI API do klienta
    //return { response: summaryWithBr };
    return summaryWithBr;
  }



});


// Funkcje DocuSec

exports.askAiDocuSec = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  let contentdoc = data.content;
  let asked = data.asked;
  //const path = `transcriptions/${uidSave}/${position}/transcript`;
  //console.log('Ścieżka:', path);


  var maxTokens = 10000; // replace with your desired token limit


  //const summarySnapshot = await admin.database().ref(path).once('value');
  let summaryVal = contentdoc;
  // console.log("summaryVal: " + summaryVal);
  // Split the transcript into fragments of maxTokens length
  console.log('Transcript before splitting into fragments:', summaryVal);
  console.log('Transcript lenght before splitting into fragments:', summaryVal.length);
  //const maxTokens = 20000; // replace with your desired token limit
  const fragments = [];
  for (let i = 0; i < summaryVal.length; i += maxTokens) {
    fragments.push(summaryVal.slice(i, i + maxTokens));
  }

  const results = [];
  // Zmienna do śledzenia aktualnego indeksu
  let currentIndex = 0;
  // Iterate over the fragments and send requests to the OpenAI API
  for (let i = 0; i < fragments.length; i++) {
    const fragment = fragments[i];
    // Pobieranie wartości impulsivity i inattention z bazy danych
    //const impulsivitySnapshot = await admin.database().ref(`secdata/${uidSave}/personal/impulsivity`).once('value');
    //let impulsivity = impulsivitySnapshot.val();

    //const inattentionSnapshot = await admin.database().ref(`secdata/${uidSave}/personal/inattention`).once('value');
    //let inattention = inattentionSnapshot.val();

    // Jeśli impulsivity lub inattention są null lub undefined, ustawiamy je na 1
    //impulsivity = impulsivity || 1;
    //inattention = inattention || 1;

    try {
      const completion = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
        model: "gpt-4o-mini-2024-07-18",
        messages: [{ role: "user", content: asked + "Treść do analizy: " + fragment }],
        temperature: 1,
      });
      const summaryOpenAi = completion.choices[0].message.content;
      console.log("SummaryOpenAi fragment: " + summaryOpenAi);

      // Store the content in the corresponding position in the results array
      results[currentIndex] = summaryOpenAi;
      currentIndex++; // Aktualizuj currentIndex po zapisaniu wyniku
    } catch (error) {
      // Handle the error
      console.error('Error processing request:', error);
    }
  }

  // Check if all fragments have been processed
  if (results.filter(Boolean).length === fragments.length) {
    // Join the results into a single summary
    const summary = results.join('<br/>');
    const summaryWithBr = summary.replace(/\n/g, "<br/>");


    // Zwróć odpowiedź z OpenAI API do klienta
    //return { response: summaryWithBr };
    return summaryWithBr;
  }



});


// Funkcja wywoływana przez Firebase
exports.processDocument = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  try {
    // Odczytanie danych przesłanych z klienta
    const documentContent = data.documentContent;
    const fileName = data.fileName;
    const uidSave = data.uidSave;

    // Wywołanie usługi Document AI i przesłanie dokumentu
    const documentProcessorClient = new DocumentProcessorServiceClient();
    const request = {
      name: processorName,
      document: {
        content: Buffer.from(documentContent, 'base64'),
        mimeType: 'application/pdf', // lub inny odpowiedni typ MIME
      },
    };

    const [response] = await documentProcessorClient.processDocument(request);

    // Odczytanie odpowiedzi
    const { text, entities } = response;

    // Przygotowanie odpowiedzi do zwrotu
    const result = {
      text: text,
      entities: entities,
    };

    // Opcjonalnie możesz zapisać odpowiedź w bazie danych Firebase
    //const uidSave = 'TU_TWÓJ_UID'; // ID użytkownika, do którego chcesz zapisać odpowiedź
    //const resultRef = admin.database().ref(`processedDocuments/${uidSave}/${fileName}`);
    //await resultRef.set(result);

    return result;
  } catch (error) {
    console.error('Błąd przetwarzania dokumentu:', error);
    throw new functions.https.HttpsError('internal', 'Wystąpił błąd podczas przetwarzania dokumentu.');
  }
});

// Funkcja, która zostanie wywołana przy zapisie pliku *.pdf w ścieżce /legal/
exports.processPDF = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).storage.object().onFinalize(async (object) => {
  const filePath = object.name;



  // Sprawdzamy, czy plik to *.pdf i czy jest w ścieżce /legal/
  if (filePath.startsWith('legal/') && filePath.endsWith('.pdf')) {

    const parts = filePath.split('/');
    const uidSave = parts[1]; // Get the uidSave
    const fileName = parts[2];
    console.log(filePath);


    // Pobieramy plik z Storage do tymczasowego pliku na serwerze Firebase
    const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
    await admin.storage().bucket().file(filePath).download({ destination: tempFilePath });

    // Sprawdzamy, czy plik to poprawny plik PDF
    const isValidPDF = await checkValidPDF(tempFilePath);
    if (!isValidPDF) {
      console.error('Niepoprawny format pliku PDF:', filePath);
      db.ref('docusecai/' + uidSave).push({
        response: 'Plik nie jest poprawnym plikiem PDF',
        fileName: fileName,
        filePath: filePath,
        date: admin.database.ServerValue.TIMESTAMP,
        status: "failed"
      });
      // Usuwamy tymczasowy plik po przetworzeniu
      unlinkSync(tempFilePath);
      return null;
    }

    // Wysyłamy plik *.pdf na endpoint przy użyciu biblioteki axios
    const endpoint = 'https://hook.eu1.make.com/njficz86yqtkmqb6c05cm0ecgclwqg3j';
    const formData = new FormData();
    formData.append('file', createReadStream(tempFilePath));
    formData.append('docuseclimit', "5");

    try {
      const response = await axios.post(endpoint, formData, {
        headers: formData.getHeaders(),
      });

      // Zapisujemy odpowiedź w realtime database w ścieżce /docusecai/uidSave/response
      const ref = db.ref('docusecai/' + uidSave).push({
        //fileContentVerbose: 'Trwa transkrypcja i wstępna analiza',
        response: response.data,
        fileName: fileName,
        filePath: filePath,
        date: admin.database.ServerValue.TIMESTAMP,
        docuAiShort: "Trwa analiza dokumentu",
        status: "processing"
      });
      const anyUniqueId = ref.key;
      console.log('Wygenerowany unikalny identyfikator:', anyUniqueId);
      console.log('Data saved successfully.');

      //tutaj dalsze przetwarzanie na AI

      try {
        const completion = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
          model: "gpt-4o-mini-2024-07-18",
          messages: [{ role: "user", content: "Okresl typ dokumentu, podsumuj w sposób rozbudowany oraz sczegółowo przeanalizuj podając najwazniejsze informacje zawarte w dokumencie wraz z komentarzem. Jeżeli analizowana treść jest Umową, wskaż najwazniejsze punkty w Umowie oraz wskaż strony Umowy. Określ również, jeżeli treśc jest Umową, czy Umowa gwarantuje róność stron.  Jeżeli analizowana treść nie jest Umową, podaj szczegółowe informacje i rozbudowane wnioski zależne od treści. Treść do analizy.: " + response.data }],
          temperature: 0.6,
        });
        const summaryOpenAi = completion.choices[0].message.content;
        console.log("Podsumowanie: " + summaryOpenAi);
        // Użyj:
        const updates = {
          docuAiShort: summaryOpenAi.replace(/\n/g, "<br/>"),
          status: "processed",
          statusAi: "processed"
        };

        db.ref('docusecai/' + uidSave + '/' + anyUniqueId).update(updates);

      } catch (error) {
        // Handle the error
        console.error('Error processing request:', error);
      }

    } catch (error) {
      console.error('Błąd podczas wysyłania pliku na endpoint:', error);

      // Zapisujemy błąd w realtime database w ścieżce /docusecai/uidSave/response
      db.ref('docusecai/' + uidSave).push({
        response: error.response ? error.response.data : 'Unknown error',
        fileName: fileName,
        filePath: filePath,
        date: admin.database.ServerValue.TIMESTAMP,
        status: "failed"
      });

      throw new Error('Błąd podczas wysyłania pliku na endpoint.');
    }



    // Usuwamy tymczasowy plik po przetworzeniu
    unlinkSync(tempFilePath);

    return null;
  }
});

exports.getWebPageData = functions.runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const pageUrl = data.url;
  const uidSave = data.uidSave;
  const isPublic = data.public;

  try {
    const response = await axios.get(pageUrl);
    const $ = cheerio.load(response.data);
    const contentPage = $('body').text();

    // Usuń białe znaki z początku i końca tekstu oraz zredukuj wielokrotne spacje do jednej
    const contentJob = contentPage.replace(/\s+/g, ' ').trim();
    console.log("Adres strony: " + pageUrl);
    console.log("Strona web 1: " + contentJob);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [{
        role: "user",
        content: "Określ tytuł ogłoszenia o pracę, określ nazwę firmy, która poszukuje pracownika oraz przygotuj podsumowanie ogłoszenia uwzględniając wymagania, zakres obowiązków i inne ważne informacje. Jeżeli treść nie jest ogłoszeniem o pracę, podaj informację, że to nie jest ogłoszenie o pracę. Odpowiedź podaj w JSON zgodnie ze strukturą: {\"title\": \"tytuł ogłoszenia\", \"company\": \"Nazwa firmy\", \"sum\": \"Podsumowanie ogłoszenia. Akapity umieść w znacznikach <p>\"}. Treść do analizy: " + contentJob
      }],
      temperature: 1,
    });

    const summaryOpenAi = completion.choices[0].message.content;
    console.log("Podsumowanie: " + summaryOpenAi);
    const titleJSON = JSON.parse(summaryOpenAi);
    const ShortJobTitle = titleJSON.title;
    const ShortJobCompany = titleJSON.company;
    const ShortJobDesc = titleJSON.sum;
    console.log("Title: " + ShortJobTitle);
    console.log("Podsumowanie: " + ShortJobDesc);

    // Generowanie obrazu
    const cutSummary = ShortJobDesc.substring(0, 600);
    console.log("cutSummary: " + cutSummary);

    const openAIImageRequestBody = JSON.stringify({
      prompt: `Create a dynamic and detailed image in the style of a GTA video game cover, based on the job description: ${cutSummary}. The image should include bold lines, vivid and intense colors. In the background, feature a cityscape, while the foreground shows a character reviewing a job offer, surrounded by icons representing CVs, documents, and work tools. The scene should capture the fast-paced, chaotic energy typical of GTA covers.`,
      n: 1,
      model: "dall-e-3",
      size: "1024x1024",
      response_format: "b64_json",
      style: "vivid"
    });

    const openAIImageOptions = {
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      }
    };

    const imageContent = await new Promise((resolve, reject) => {
      const openAIImageReq = https.request(openAIImageOptions, (openAIImageRes) => {
        let openAIImageResponseData = '';

        openAIImageRes.on('data', (chunk) => {
          openAIImageResponseData += chunk;
        });

        openAIImageRes.on('end', () => {
          try {
            const openAIImageResponseJson = JSON.parse(openAIImageResponseData);
            resolve(openAIImageResponseJson.data[0].b64_json);
          } catch (error) {
            reject(new Error('Error parsing OpenAI API Image response: ' + error.message));
          }
        });
      });

      openAIImageReq.on('error', (error) => {
        reject(new Error('Error calling OpenAI API: ' + error.message));
      });

      openAIImageReq.write(openAIImageRequestBody);
      openAIImageReq.end();
    });

    const result = {
      title: ShortJobTitle,
      ImageAi: imageContent || 'pusty',
      ShortJobCompany: ShortJobCompany,
      ShortJobDesc: ShortJobDesc,
      body: contentJob,
      thumbnail: $('meta[property="og:image"]').attr('content') || 'https://uploads-ssl.webflow.com/665dbab45e402b0f1c64ddea/6678149533f00db91701dd24_jobimage.jpeg',
      uidSave: uidSave,
      accepted: true,
      date: admin.database.ServerValue.TIMESTAMP,
      url: pageUrl,
      public: isPublic
    };
    console.log("Strona web: " + result);

    await admin.database().ref('cvBuddy/' + uidSave + '/cvProject/').push(result);

    return result;

  } catch (error) {
    console.error('Error fetching data from web page', error);
    throw new functions.https.HttpsError('internal', 'Unable to fetch data from web page');
  }
});

exports.getWebPageDataTest = functions.runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const pageUrl = data.url;
  const uidSave = data.uidSave;
  const isPublic = data.public;

  try {

    // Przekaż URL do zewnętrznego API
    const apiResponse = await axios.post('https://hook.eu1.make.com/d4hipk6boerkkwufzzuyxve8zt5vaesq', { pageUrl });

    if (!apiResponse.data || !apiResponse.data.link) {
      throw new functions.https.HttpsError('invalid-response', 'Invalid response from external API');
    }
    console.log("odpowiedz po konwersji: " + apiResponse.data);
    //console.log("link odpowiedz po konwersji: " + apiResponse.data.link);

    // Pobierz zawartość pliku tekstowego
    const fileResponse = await axios.get(apiResponse.data);
    const contentJob = fileResponse.data;

    // Wyświetl zawartość pliku tekstowego w konsoli
    //console.log('Text file content:', textContent);




    console.log("Adres strony: " + pageUrl);
    console.log("Strona web 1: " + contentJob);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [{
        role: "user",
        content: "Określ tytuł ogłoszenia o pracę, określ pełną i dokładną nazwę firmy która poszukuje pracownika oraz przygotuj podsumowanie ogłoszenia uwzględniając wymagania, zakres obowiązków i inne ważne informacje. Jeżeli treść nie jest ogłoszeniem o pracę, podaj informację, że to nie jest ogłoszenie o pracę. Odpowiedź podaj w JSON zgodnie ze strukturą: {\"title\": \"tytuł ogłoszenia\", \"company\": \"Nazwa firmy\", \"sum\": \"Podsumowanie ogłoszenia. Akapity umieść w znacznikach <p>\"}. Treść do analizy: " + contentJob
      }],
      temperature: 1,
    });

    const summaryOpenAi = completion.choices[0].message.content;
    console.log("Podsumowanie: " + summaryOpenAi);
    const titleJSON = JSON.parse(summaryOpenAi);
    const ShortJobTitle = titleJSON.title;
    const ShortJobCompany = titleJSON.company;
    const ShortJobDesc = titleJSON.sum;
    console.log("Title: " + ShortJobTitle);
    console.log("Podsumowanie: " + ShortJobDesc);

    //Opinie o Firmie


    const completionCompany = await openai.chat.completions.create({
      model: "gpt-4o",
      //response_format: { type: "json_object" },
      messages: [{
        role: "user",
        content: "znajdz wszystkie dostępne informacje o " + ShortJobCompany + " oraz dostępne opinie na jej temat przydatne dla osoby starającej sie o pracę. Proszę unikać używania znaków typu **. Każdy punkt umieść w znacznikach <b> natomiast treść punktu w znacznikach <p>. Odpowiedz po Polsku."
        //content: "Określ tytuł ogłoszenia o pracę, określ pełną nazwę firmy, która poszukuje pracownika oraz przygotuj podsumowanie ogłoszenia uwzględniając wymagania, zakres obowiązków i inne ważne informacje. Jeżeli treść nie jest ogłoszeniem o pracę, podaj informację, że to nie jest ogłoszenie o pracę. Odpowiedź podaj w JSON zgodnie ze strukturą: {\"title\": \"tytuł ogłoszenia\", \"company\": \"Nazwa firmy\", \"sum\": \"Podsumowanie ogłoszenia. Akapity umieść w znacznikach <p>\"}. Treść do analizy: " + contentJob
      }],
      temperature: 1,
    });

    const cvBuddyCompany = completionCompany.choices[0].message.content;



    // Generowanie obrazu
    const cutSummary = ShortJobDesc;
    console.log("cutSummary: " + cutSummary);

    const openAIImageRequestBody = JSON.stringify({
      prompt: "Przygotuj zdjęcie z mała ilością szczegółów, z soczystymi i intensywnymi kolorami, oddające pracę zgodnie z opisem: " + cutSummary,
      n: 1,
      model: "dall-e-3",
      size: "1024x1024",
      response_format: "b64_json"
    });

    const openAIImageOptions = {
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      }
    };

    const imageContent = await new Promise((resolve, reject) => {
      const openAIImageReq = https.request(openAIImageOptions, (openAIImageRes) => {
        let openAIImageResponseData = '';

        openAIImageRes.on('data', (chunk) => {
          openAIImageResponseData += chunk;
        });

        openAIImageRes.on('end', () => {
          try {
            const openAIImageResponseJson = JSON.parse(openAIImageResponseData);
            resolve(openAIImageResponseJson.data[0].b64_json);
          } catch (error) {
            reject(new Error('Error parsing OpenAI API Image response: ' + error.message));
          }
        });
      });

      openAIImageReq.on('error', (error) => {
        reject(new Error('Error calling OpenAI API: ' + error.message));
      });

      openAIImageReq.write(openAIImageRequestBody);
      openAIImageReq.end();
    });

    const result = {
      title: ShortJobTitle,
      ImageAi: imageContent || 'pusty',
      ShortJobCompany: ShortJobCompany,
      cvBuddyCompany: cvBuddyCompany,
      ShortJobDesc: ShortJobDesc,
      body: contentJob,
      //thumbnail: $('meta[property="og:image"]').attr('content') || 'https://uploads-ssl.webflow.com/665dbab45e402b0f1c64ddea/6678149533f00db91701dd24_jobimage.jpeg',
      uidSave: uidSave,
      accepted: true,
      date: admin.database.ServerValue.TIMESTAMP,
      url: pageUrl,
      public: isPublic
    };
    console.log("Strona web: " + result);

    await admin.database().ref('cvBuddy/' + uidSave + '/cvProject/').push(result);

    return result;

  } catch (error) {
    console.error('Error fetching data from web page', error);
    throw new functions.https.HttpsError('internal', 'Unable to fetch data from web page');
  }
});

exports.processUrl = functions.https.onCall(async (data, context) => {
  // Uwierzytelnienie użytkownika
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  // Pobierz URL z danych
  const url = data.url;

  if (!url) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a URL.');
  }

  try {
    // Przekaż URL do zewnętrznego API
    const apiResponse = await axios.post('https://hook.eu1.make.com/d4hipk6boerkkwufzzuyxve8zt5vaesq', { url });

    if (!apiResponse.data || !apiResponse.data.link) {
      throw new functions.https.HttpsError('invalid-response', 'Invalid response from external API');
    }
    console.log("odpowiedz po konwersji: " + apiResponse.data);
    //console.log("link odpowiedz po konwersji: " + apiResponse.data.link);

    // Pobierz zawartość pliku tekstowego
    const fileResponse = await axios.get(apiResponse.data);
    const textContent = fileResponse.data;

    // Wyświetl zawartość pliku tekstowego w konsoli
    console.log('Text file content:', textContent);


    return { message: 'Text file content processed successfully', textContent };
  } catch (error) {
    console.error('Error processing URL:', error);
    throw new functions.https.HttpsError('internal', 'Unable to process URL');
  }
});

//Funkcje Buddy Reader


// Eksport funkcji Cloud Function
exports.processReaderConvert = functions
  .region('europe-central2')
  .runWith({ timeoutSeconds: 540, memory: '1GB' }) // Zwiększona pamięć dla przetwarzania dużych plików
  .storage.object()
  .onFinalize(async (object) => {
    const filePath = object.name;

    // Dozwolone rozszerzenia plików
    const allowedExtensions = ['.pdf', '.epub', '.mobi'];
    const fileExtension = path.extname(filePath).toLowerCase();

    // Sprawdzenie, czy plik jest w katalogu /reader/ i ma dozwolone rozszerzenie
    if (filePath.startsWith('reader/') && allowedExtensions.includes(fileExtension)) {
      const parts = filePath.split('/');
      const uidSave = parts[1]; // Pobranie UID użytkownika
      const fileName = parts[2];
      console.log(`Przetwarzanie pliku: ${filePath}`);

      // Określenie formatu na podstawie rozszerzenia
      let formatValue;
      switch (fileExtension) {
        case '.pdf':
          formatValue = 'pdf';
          break;
        case '.epub':
          formatValue = 'epub';
          break;
        case '.mobi':
          formatValue = 'mobi';
          break;
        default:
          formatValue = 'unknown';
      }

      // Pobranie pliku z Storage do tymczasowego katalogu
      const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
      await admin.storage().bucket().file(filePath).download({ destination: tempFilePath });
      console.log(`Pobrano plik do: ${tempFilePath}`);

      if (formatValue === 'epub') {
        // Obsługa plików EPUB
        let textContent = '';

        try {
          textContent = await convertEpubToText(tempFilePath);
          console.log('Konwersja EPUB na TXT zakończona sukcesem.');
        } catch (error) {
          console.error('Błąd podczas konwersji EPUB na TXT:', error);
          await admin.database().ref(`reader/${uidSave}/books`).push({
            response: 'EPUB conversion error',
            fileName: fileName,
            filePath: filePath,
            date: admin.database.ServerValue.TIMESTAMP,
            status: "failed"
          });
          unlinkSync(tempFilePath);
          return null;
        }

        // Zapisanie skonwertowanego tekstu bezpośrednio w Realtime Database
        try {
          const truncatedText = textContent.slice(0, 500);

          // Generowanie tytułu i autora za pomocą OpenAI
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-2024-08-06",
            response_format: { type: "json_object" },
            messages: [{
              role: "user",
              content: `Na podstawie treści określ tytuł oraz autora. Odpowiedz podaj w JSON zgodnie ze strukturą:
              
              {
                "title":"Tytuł pozycji",
                "autor" : "autor pozycji"
              }
              
              Treść do analizy: ${truncatedText}`
            }],
            temperature: 1,
          });

          const openAiContent = completion.choices[0].message.content;
          const parsedContent = JSON.parse(openAiContent);
          const bookTitle = parsedContent.title || 'Nieznany';
          const bookAuthor = parsedContent.autor || 'Nieznany';
          console.log('Wyciągnięte dane z OpenAI:', parsedContent);

          // Zapisanie danych w Realtime Database
          await admin.database().ref(`reader/${uidSave}/books`).push({
            body: textContent,
            title: bookTitle,
            author: bookAuthor,
            ImageAi: 'https://www.acadecraft.com/images/Accessibility-for-EPUB3/use-cases.png', // Opcjonalnie można dodać obsługę obrazów dla EPUB
            fileName: fileName,
            filePath: filePath,
            date: admin.database.ServerValue.TIMESTAMP,
            cvAiShort: "Trwa analiza dokumentu",
            status: "processed"
          });

          console.log('Dane zostały pomyślnie zapisane w Realtime Database.');

        } catch (error) {
          console.error('Błąd podczas zapisywania danych w Realtime Database:', error);
          await admin.database().ref(`reader/${uidSave}/books`).push({
            response: 'Database save error',
            fileName: fileName,
            filePath: filePath,
            date: admin.database.ServerValue.TIMESTAMP,
            status: "failed"
          });
        }

      } else if (formatValue === 'pdf' || formatValue === 'mobi') {
        // Obsługa plików PDF i MOBI
        // Tworzenie formularza danych do wysłania
        const endpoint = 'https://hook.eu1.make.com/f9frpsl09k61z1lt8b0u6ga373jt3da8';
        const formData = new FormData();
        formData.append('file', createReadStream(tempFilePath));
        formData.append('addedvalue', "5");
        formData.append('user', "userid");
        formData.append('format', formatValue); // Dodanie odpowiedniego formatu

        try {
          const response = await axios.post(endpoint, formData, {
            headers: formData.getHeaders(),
          });

          // Przetwarzanie odpowiedzi
          console.log(response.data);
          const responseBody = response.data.full;
          const pageViewUrl = response.data.pageview;
          const truncatedText = responseBody.slice(0, 500);

          // Pobranie obrazu z pageViewUrl i konwersja do Base64 (opcjonalnie)
          let base64Image = '';
          if (pageViewUrl) {
            try {
              const imageResponse = await axios.get(pageViewUrl, { responseType: 'arraybuffer' });
              const buffer = Buffer.from(imageResponse.data, 'binary');
              const mimeType = imageResponse.headers['content-type'] || 'image/jpeg';
              base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;
              console.log('Obraz został pomyślnie pobrany i skonwertowany do Base64.');
            } catch (imageError) {
              console.error('Błąd podczas pobierania lub konwertowania obrazu:', imageError);
              base64Image = null;
            }
          } else {
            console.warn('Pole pageview nie zawiera URL obrazu.');
          }

          // Generowanie tytułu i autora za pomocą OpenAI
          let completion;
          try {
            completion = await openai.chat.completions.create({
                model: "gpt-4o-2024-08-06",
                response_format: { type: "json_object" },
              messages: [{
                role: "user",
                content: `Na podstawie treści określ tytuł oraz autora. Odpowiedz podaj w JSON zgodnie ze strukturą:
                
                {
                  "title":"Tytuł pozycji",
                  "autor" : "autor pozycji"
                }
                
                Treść do analizy: ${truncatedText}`
              }],
              temperature: 1,
            });
            const summaryOpenAi = completion.choices[0].message.content;
            console.log("Podsumowanie: " + summaryOpenAi);
          } catch (error) {
            console.error('Error processing OpenAI request:', error);
            await admin.database().ref(`reader/${uidSave}/books`).push({
              response: 'OpenAI error',
              fileName: fileName,
              filePath: filePath,
              date: admin.database.ServerValue.TIMESTAMP,
              status: "failed"
            });
            return null;
          }

          // Przetwarzanie odpowiedzi OpenAI
          let openAiContent;
          try {
            openAiContent = completion.choices[0].message.content;
            const parsedContent = JSON.parse(openAiContent);
            const bookTitle = parsedContent.title || 'Nieznany';
            const bookAuthor = parsedContent.autor || 'Nieznany';
            console.log('Wyciągnięte dane z OpenAI:', parsedContent);

            // Zapisanie danych w Realtime Database
            await admin.database().ref(`reader/${uidSave}/books`).push({
              body: responseBody,
              title: bookTitle,
              author: bookAuthor,
              ImageAi: base64Image || 'Brak obrazu',
              fileName: fileName,
              filePath: filePath,
              date: admin.database.ServerValue.TIMESTAMP,
              cvAiShort: "Trwa analiza dokumentu",
              status: "processed"
            });

            console.log('Dane zostały pomyślnie zapisane w Realtime Database.');

          } catch (parseError) {
            console.error('Błąd podczas parsowania odpowiedzi OpenAI:', parseError);
            await admin.database().ref(`reader/${uidSave}/books`).push({
              response: 'OpenAI parse error',
              fileName: fileName,
              filePath: filePath,
              date: admin.database.ServerValue.TIMESTAMP,
              status: "failed"
            });
          }

        } catch (error) {
          console.error('Błąd podczas wysyłania pliku na endpoint:', error);

          // Zapisanie błędu w Realtime Database
          await admin.database().ref(`reader/${uidSave}/books`).push({
            response: error.response ? error.response.data : 'Unknown error',
            fileName: fileName,
            filePath: filePath,
            date: admin.database.ServerValue.TIMESTAMP,
            status: "failed"
          });

          // Usunięcie tymczasowego pliku
          unlinkSync(tempFilePath);
          return null;
        }
      }

      // Usunięcie tymczasowego pliku po przetworzeniu
      unlinkSync(tempFilePath);
      return null;
    } else {
      console.log('Plik nie spełnia kryteriów przetwarzania.');
      return null;
    }
  });


exports.getReaderBook = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Użytkownik musi być zalogowany, aby wywołać tę funkcję.'
    );
  }

  const uid = context.auth.uid;
  const bookKey = data.key;

  // Sprawdzenie, czy bookKey został dostarczony
  if (!bookKey) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Brak klucza książki (key).'
    );
  }

  const bookPath = `reader/${uid}/books/${bookKey}`;
  
  try {
    const readerBookSnapshot = await admin.database().ref(bookPath).once('value');

    if (!readerBookSnapshot.exists()) {
      throw new functions.https.HttpsError(
        'not-found',
        'Książka o podanym kluczu nie została znaleziona.'
      );
    }

    const bookData = readerBookSnapshot.val();

    const title = bookData.title;
    const body = bookData.body;
    const place = bookData.place || 0;

    // Sprawdzenie, czy title i body istnieją
    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new functions.https.HttpsError(
        'data-loss',
        'Dane książki są niekompletne lub uszkodzone.'
      );
    }

    // Zwrócenie danych do klienta
    return { title, body, place };
    
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      // Jeśli błąd jest typu HttpsError, przekazujemy go dalej
      throw error;
    } else {
      // Inne błędy
      console.error('Błąd podczas pobierania książki:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Wystąpił nieoczekiwany błąd podczas pobierania książki.'
      );
    }
  }
});

exports.setBookReadPlace = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Użytkownik musi być zalogowany, aby wywołać tę funkcję.'
    );
  }

  const uid = context.auth.uid;
  const bookKey = data.key;
  const place = data.place;
  await admin.database().ref(`reader/${uid}/books/${bookKey}/place`).set(place);
  

});


// Funkcja, która zostanie wywołana przy zapisie pliku *.pdf w ścieżce /legal/
exports.processCvPDF = functions.region('europe-central2').runWith({ memory: '4GB', timeoutSeconds: 540 }).storage.object().onFinalize(async (object) => {
  const filePath = object.name;



  // Sprawdzamy, czy plik to *.pdf i czy jest w ścieżce /legal/
  if (filePath.startsWith('cvBuddy/') && filePath.endsWith('.pdf')) {

    const parts = filePath.split('/');
    const uidSave = parts[1]; // Get the uidSave
    const uid = uidSave;
    const fileName = parts[2];
    console.log(filePath);

    const activityLevel = await checkUserActivityLevel(uid);
    console.log('Poziom aktywności użytkownika:', activityLevel);


    // Pobieramy plik z Storage do tymczasowego pliku na serwerze Firebase
    const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
    await admin.storage().bucket().file(filePath).download({ destination: tempFilePath });

    // Sprawdzamy, czy plik to poprawny plik PDF
    const isValidPDF = await checkValidPDF(tempFilePath);
    if (!isValidPDF) {
      console.error('Niepoprawny format pliku PDF:', filePath);
      db.ref('cvBuddy/' + uidSave + '/cv').set({
        response: 'Plik nie jest poprawnym plikiem PDF',
        fileName: fileName,
        filePath: filePath,
        date: admin.database.ServerValue.TIMESTAMP,
        status: "failed"
      });
      // Usuwamy tymczasowy plik po przetworzeniu
      unlinkSync(tempFilePath);
      return null;
    }

    // Wysyłamy plik *.pdf na endpoint przy użyciu biblioteki axios
    const endpoint = 'https://hook.eu1.make.com/njficz86yqtkmqb6c05cm0ecgclwqg3j';
    const formData = new FormData();
    formData.append('file', createReadStream(tempFilePath));
    formData.append('docuseclimit', "5");

    try {
      const response = await axios.post(endpoint, formData, {
        headers: formData.getHeaders(),
      });

      // Zapisujemy odpowiedź w realtime database w ścieżce /docusecai/uidSave/response
      const ref = db.ref('cvBuddy/' + uidSave + '/cv').set({
        //fileContentVerbose: 'Trwa transkrypcja i wstępna analiza',
        response: response.data,
        fileName: fileName,
        filePath: filePath,
        date: admin.database.ServerValue.TIMESTAMP,
        cvAiShort: "Trwa analiza dokumentu",
        status: "processing"
      });
      //const anyUniqueId = ref.key;
      //console.log('Wygenerowany unikalny identyfikator:', anyUniqueId);
      console.log('Data saved successfully.');

      //tutaj dalsze przetwarzanie na AI

      try {
        const completion = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
          model: "gpt-4o-2024-08-06",
          response_format: { type: "json_object" },
          messages: [{
            role: "user",
            //content: "Wyodrębnij całą historię zatrudnienia. Nie dokonuj zmian i korekty w tekście. wykonaj również krótkie podsumowanie na kilka zdań. Odpowiedz podaj tylko w JSON zwracając uwagę na poprawną budowę JSON. Wymagana struktura JSON odpowiedzi:{\"Edukacja\": [{\"Lp\": \"1\",\"Uczelnia\": \"Nazwa uczelni\",\"Tytuł\": \"Uzyskany tytuł\",\"OkresStart\": \"Początek studiów\",\"OkresEnd\": \"Zakończenie\",\"Kierunek\": \"Kierunek wykształcenia\"}], \"Podsumowanie\": \"Tutaj krótkie podsumowanie\",  \"Historia_zatrudnienia\": [{\"Lp\":\"Numer kolejny\",\"Stanowisko\":\"Nazwa stanowiska\",\"Firma\":\"Firma\",\"OkresStart\":\"początkowa data zatrudnienia\",\"OkresEnd\":\"końcowa data zatrudnienia\",\"Opis_stanowiska\":\"Opis stanowiska lub zakres obowiązków i odpowiedzialności. Pozycje w punktach umieść każdy w tagach <p>\"}]} Treść do analizy: " + response.data }],
            content: `Wyodrębnij całą historię zatrudnienia. Nie dokonuj zmian i korekty w tekście. Wyodrębnij rónież pozostałe (dodatkowe) informacje takie jak znajomość języków obcych, projekty, znajomość oprogramowania, umiejętności, kompetencje, zainteresowania, dane kontaktowe oraz dane osobowe jako sekcje, o ile istnieją. Odpowiedz podaj tylko w JSON zwracając uwagę na poprawną budowę JSON. Wymagana struktura JSON odpowiedzi:
            {
  "Edukacja": [
    {
      "Lp": "1",
      "Uczelnia": "Nazwa uczelni",
      "Tytuł": "Uzyskany tytuł",
      "OkresStart": "Początek studiów",
      "OkresEnd": "Zakończenie",
      "Kierunek": "Kierunek wykształcenia"
    }
  ],
  "Podsumowanie": "Tutaj podaj informacje dodatkowe jako string w podziale na sekcje w układzie <h5>Tytuł sekcji</h5> <p>informacje dodatkowe </p>",
  "Contact": "Zidentyfikowane dane kontaktowe",
  "Projects": "Zidentyfikowane projekty, pogrupowane pojedynczo",
  "Historia_zatrudnienia": [
    {
      "Lp": "Numer kolejny",
      "Stanowisko": "Nazwa stanowiska",
      "Firma": "Firma",
      "OkresStart": "początkowa data zatrudnienia",
      "OkresEnd": "końcowa data zatrudnienia",
      "Opis_stanowiska": "Opis stanowiska lub zakres obowiązków i odpowiedzialności. Pozycje w punktach umieść każdy w tagach <p>"
    }
  ]
}
            Treść do analizy: ` + response.data
          }],
          temperature: 1,
        });
        const summaryOpenAi = completion.choices[0].message.content;
        console.log("Podsumowanie: " + summaryOpenAi);
        // Użyj:



        const updates = {
          // cvAiShort: summaryOpenAi.replace(/\n/g, "<br/>"),
          cvAiShort: summaryOpenAi,
          testJSON: JSON.parse(summaryOpenAi),
          status: "processed",
          statusAi: "processed"
        };

        db.ref('cvBuddy/' + uidSave + '/cv').update(updates);

      } catch (error) {
        // Handle the error
        console.error('Error processing request:', error);
      }

    } catch (error) {
      console.error('Błąd podczas wysyłania pliku na endpoint:', error);

      // Zapisujemy błąd w realtime database w ścieżce /docusecai/uidSave/response
      db.ref('cvBuddy/' + uidSave + '/cv').set({
        response: error.response ? error.response.data : 'Unknown error',
        fileName: fileName,
        filePath: filePath,
        date: admin.database.ServerValue.TIMESTAMP,
        status: "failed"
      });

      throw new Error('Błąd podczas wysyłania pliku na endpoint.');
    }



    // Usuwamy tymczasowy plik po przetworzeniu
    unlinkSync(tempFilePath);

    return null;
  }
});

exports.cvBuddyAnalize = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Użytkownik musi być zalogowany, aby wywołać tę funkcję.'
    );
  }

  const uidSave = context.auth.uid;
  const addedContext = data.addedContext;
  
  const position = data.positionid;
  const cvPathJob = `cvBuddy/${uidSave}/cv/cvAiShort`;
  const rekPathSum = `cvBuddy/${uidSave}/cvProject/${position}/ShortJobDesc`;

  try {
    const cvJobSnapshot = await admin.database().ref(cvPathJob).once('value');
    const rekJobSnapshot = await admin.database().ref(rekPathSum).once('value');
    const dbRef = admin.database().ref(); // Użycie admin zamiast firebase
    const testPaths = ['ADHDSelfCheck', 'InsightDiscovery'];

    const results = {};

    for (let path of testPaths) {
      const snapshot = await dbRef.child(`Neuroinsights/${uidSave}/${path}`).once('value');

      if (snapshot.exists()) {
        let latestDate = 0;
        let testDesc = '';
        snapshot.forEach(childSnapshot => {
          const date = childSnapshot.val().date;
          const comment = childSnapshot.val().comment;
          if (date > latestDate) {
            latestDate = date;
            testDesc = comment;
          }
        });
        results[path] = testDesc;
      } else {
        results[path] = 'brak danych';
      }
    }

    const cvJobVal = cvJobSnapshot.val();
    const rekJobVal = rekJobSnapshot.val();

    console.log(cvJobVal);
    console.log(rekJobVal);

    const neuroComments = Object.entries(results)
      .map(([key, comment]) => `${key}: ${comment}`)
      .join('\n');
    console.log("NeuroComments: " + neuroComments);
    const promptContent = `
    Na podstawie mojego CV, wyników testów osobowości oraz treści ogłoszenia o pracę, przeprowadź analizę dopasowania moich kwalifikacji oraz cech osobowości do wymagań stanowiska. 
    
    Twoje zadanie:
    1. Oceń, czy moje CV i cechy osobowości są odpowiednie do ogłoszenia o pracę.
    2. Zasugeruj zmiany w CV, aby lepiej dopasować je do ogłoszenia o pracę. Sugestie powinny obejmować konkretne przykłady.
    3. Jeżeli specyfika ogłoszenia tego wymaga, zasugeruj również zmiany w zakresie prezentacji doświadczenia, w tym wyróżnienie osiągnięć, które warto podkreślić.
    
    Podaj swoją odpowiedź w strukturze JSON w następującym układzie:
    {
      "analiza": "Tutaj zamieść całą analizę w znacznikach HTML (<h5>, <p>, <b>, <li>) bez żadnych dodatkowych znaków HTML",
      "dopasowaniePre": "Podaj, w jakim stopniu moje obecne CV, uwzględniając wyniki testów psychologicznych, odpowiada ogłoszeniu o pracę. Wynik podaj w skali od 0 do 100, gdzie 100 oznacza idealne dopasowanie przed wprowadzeniem zmian",
      "dopasowaniePost": "Podaj przewidywane dopasowanie po wprowadzeniu sugerowanych zmian, uwzględniając wyniki testów psychologicznych. Wynik podaj w skali od 0 do 100, gdzie 100 oznacza idealne dopasowanie po wprowadzeniu zmian"
    }
    
    Dane wejściowe:
    - Moje CV: ${cvJobVal}
    - Ogłoszenie o pracę: ${rekJobVal}
    - Wyniki testów psychologicznych: ${neuroComments}
    - Dodatkowe informacje do analizy: ${addedContext}
    `;
    
   // const promptContent = `Na podstawie danych mojego CV oraz wyników testów osobowości określ, czy moje CV oraz moje cechy osobowości są odpowiednie do ogłoszenia o pracę.  Zasugeruj ewentualne zmiany w CV tak, aby lepiej dopasować je do ogłoszenia o pracę. Sugestie zmiany uzupełnij o pasujące przykłady. Jeżeli specyfika ogłoszenia tego wymaga, sugestie powinny zawierać ewentualne zmiany w zakresie prezentacji doświadczenia pokazujące, jakie ewentualnie sukcesy zostay osiagniete które warto pokazać w CV. Odpowiedź podaj jako tekst w odpowiednich znacznikach <h5>, <p>, <b> oraz <li> bez żadnych dodatkowych znaków html. Całą odpowiedz umieść w strukturze JSON w układzie:
   // {
   // "analiza": "Tutaj umieśc cała analizę w znacznikach html",
   // "dopasowaniePre": "Tutaj podaj w jakim stopniu Twoje obecne CV uwzględniając wyniki testów psychologicznych odpowiada ogłoszeniu o pracę. wynik podaj w skali od 0 do 100 gdzie 100 //oznacza idealne dopasowanie przed ewentualną modyfikacją CV",
   // "dopasowaniePost":"Tutaj podaj oszacowane dopasowanie CV po wprowadzeniu sugerowanych zmian uwzgledniając wyniki testów psychologicznych odpowiada ogłoszeniu o pracę. Wynik podaj w skali od 0 do 100 gdzie 100 oznacza idealne dopasowanie po modyfikacj CV zgodnie ze wskazówkami"
    //}
    //Moje CV: ${cvJobVal}, ogłoszenie o pracę: ${rekJobVal}. Wyniki testów psychologicznych: ${neuroComments}`;
    
    //const promptContent = "Na podstawie danych mojego CV określ, czy moje CV jest odpowiednie do ogłoszenia o pracę. Zasugeruj ewentualne zmiany w cv aby lepiej dopasować je do ogłoszenia o pracę. Odpowiedź podaj jako tekst w odpowiednich znacznikach takich jak <p> czy <li>. Moje CV :" + cvJobVal + " ogłoszenie o pracę: "+ rekJobVal;

    //console.log(promptContent);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      temperature: 1.1,
      response_format: { type: "json_object" },
      messages: [{
        role: "user",
        content: promptContent
      }]
    });
    const contentParsed = JSON.parse(completion.choices[0].message.content);
    const summaryOpenAi = contentParsed.analiza;
    
    //console.log("Podsumowanie: " + summaryOpenAi);

    const updates = {
      cvAnal: summaryOpenAi,
      dopasowaniePre: contentParsed.dopasowaniePre,
      dopasowaniePost: contentParsed.dopasowaniePost,
      addedContext: addedContext
    };

    await admin.database().ref(`cvBuddy/${uidSave}/cvProject/${position}`).update(updates);


    const checkLimitRef = admin.database().ref(`secdata/${uidSave}/personal/checkCvLimit`);
    try {
      await checkLimitRef.transaction(currentValue => {
        return (currentValue || 0) + 1;
      });
    } catch (error) {
      console.error('Error incrementing check limit:', error);
    }






  } catch (error) {
    console.error('Error processing request:', error);
    throw new functions.https.HttpsError('internal', 'Unable to process request');
  }
});

exports.cvBuddyLm = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const position = data.positionid;
  const uidSave = data.uidSave;
  const lang = data.lang;
  const cvPathJob = `cvBuddy/${uidSave}/cv/cvAiShort`;
  const rekPathSum = `cvBuddy/${uidSave}/cvProject/${position}/ShortJobDesc`;
  const rekPathRecomendation = `cvBuddy/${uidSave}/cvProject/${position}/cvAnal`;
  const addedContext = `cvBuddy/${uidSave}/cvProject/${position}/addedContext`;

  try {
    const cvJobSnapshot = await admin.database().ref(cvPathJob).once('value');
    const rekJobSnapshot = await admin.database().ref(rekPathSum).once('value');
    const rekRecSnapshot = await admin.database().ref(rekPathRecomendation).once('value');
    const addedContextSnapshot = await admin.database().ref(addedContext).once('value');

    const cvJobVal = cvJobSnapshot.val();
    const rekJobVal = rekJobSnapshot.val();
    const rekJobRecomVal = rekRecSnapshot.val();
    const addedContextVal = addedContextSnapshot.val();

    console.log(cvJobVal);
    console.log(rekJobVal);
    console.log(rekJobRecomVal);

    const completion = await openai.chat.completions.create({
      model: "o1-preview-2024-09-12",
      messages: [{
        role: "user",
        content: "Na podstawie danych mojego CV, podsumowania ogłoszenia o pracę oraz Podsumowanie analizy dopasowania CV do ogłoszenia przygotuj treść Listu Motywacyjnego. Odpowiedź podaj jako tekst w odpowiednich znacznikach <p>, <b> oraz <li> bez żadnych dodatkowych znaków html. Odpowiedż podaj w języku " + lang + ". Moje CV : " + cvJobVal + " ogłoszenie o pracę: " + rekJobVal + " analiza dopasowania ogłoszenia do CV: " + rekJobRecomVal + ". Uwzglęnij, jeżeli stnieją, dodatkowe informacje : " + addedContextVal
      }]
    });

    const summaryOpenAi = completion.choices[0].message.content;
    console.log("Podsumowanie: " + summaryOpenAi);

    const updates = {
      cvLm: summaryOpenAi
    };

    await admin.database().ref(`cvBuddy/${uidSave}/cvProject/${position}`).update(updates);
    const checkLimitRef = admin.database().ref(`secdata/${uidSave}/personal/checkLmLimit`);
    try {
      await checkLimitRef.transaction(currentValue => {
        return (currentValue || 0) + 1;
      });
    } catch (error) {
      console.error('Error incrementing check limit:', error);
    }
  } catch (error) {
    console.error('Error processing request:', error);
  }
});

exports.cvBuddyRecommendCv = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Użytkownik musi być zalogowany, aby wywołać tę funkcję.'
    );
  }

  const uidSave = context.auth.uid;
  const position = data.positionid;
  const lang = data.lang;
  const cvPathJob = `cvBuddy/${uidSave}/cv/response`;
  const rekPathSum = `cvBuddy/${uidSave}/cvProject/${position}/body`;
  const rekPathRecomendation = `cvBuddy/${uidSave}/cvProject/${position}/cvAnal`;
  const pathTimeout = `cvBuddy/${uidSave}/cvProject/${position}/cvRecommendedTimeout`;
  const addedContext = `cvBuddy/${uidSave}/cvProject/${position}/addedContext`;

  const updatesPre = {
    cvRecommended: "<h6>Zadanie wygenerowania propozycji CV zostało przekazane do analizy. AI cięko pracuje, i wkrótce wynik pojawi się tutaj.</h6>"
  };

  await admin.database().ref(`cvBuddy/${uidSave}/cvProject/${position}`).update(updatesPre);

  let timedOut = false;

  // Timer ustawiony na 530 sekund (10 sekund przed zakończeniem funkcji)
  const timeoutHandler = setTimeout(() => {
    timedOut = true;
    console.error('Funkcja przekroczyła czas, nie udało się zakończyć procesu.');
    // Aktualizacja bazy danych informująca o przekroczeniu czasu
    const updatesTimeout = {
      cvRecommendedTimeout: 1,
      cvRecommended:"<h6>Wystąpił błąd. Prosimy, wygeneruj jeszcze raz za kilka minut.</h6>"

    };
    admin.database().ref(`cvBuddy/${uidSave}/cvProject/${position}`).update(updatesTimeout);
  }, 530000); // 530 sekund w milisekundach

  try {
    const cvJobSnapshot = await admin.database().ref(cvPathJob).once('value');
    const rekJobSnapshot = await admin.database().ref(rekPathSum).once('value');
    const rekRecSnapshot = await admin.database().ref(rekPathRecomendation).once('value');
    const pathTimeoutSnapshot = await admin.database().ref(pathTimeout).once('value');
    const addedContextSnapshot = await admin.database().ref(addedContext).once('value');
    const pathTimeoutVal = pathTimeoutSnapshot.val();
    const addedContextVal = addedContextSnapshot.val();
    let modelAi = "";
    if (pathTimeoutVal === 1) {
      modelAi = "o1-mini-2024-09-12"
    } else {
      modelAi = "o1-preview-2024-09-12"
      //modelAi = "gpt-4o-2024-08-06"
    }
    

    if (timedOut) return; // Jeśli funkcja już przekroczyła czas, przerywamy wykonywanie

    const cvJobVal = cvJobSnapshot.val();
    const rekJobVal = rekJobSnapshot.val();
    const rekJobRecomVal = rekRecSnapshot.val();

    console.log(cvJobVal);
    console.log(rekJobVal);
    console.log(rekJobRecomVal);
    console.log("modelAi: " + modelAi);

    const completion = await openai.chat.completions.create({
      //model: "o1-mini-2024-09-12",
      model: modelAi,
      messages: [{
        role: "user",
        content: `
        Na podstawie danych obecnego CV, ogłoszenia o pracę oraz podsumowania analizy dopasowania CV do ogłoszenia, przygotuj rozbudowaną wersję najlepiej dopasowanego CV.
        
        Twoje zadanie:
        1. Przygotuj pełną wersję CV, uwzględniając wszystkie informacje dotyczące historii zatrudnienia, wykształcenia, doświadczenia, edukacji oraz informacji dodatkowych. Nie usuwaj żadnych informacji z obecnego CV.
        2. Rozbuduj obecne CV, wprowadzając korekty i dodając informacje sugerowane przez analizę dopasowania CV do ogłoszenia, ale nie usuwaj żadnych istniejących pozycji.
        3. Stwórz taką wersję CV, która maksymalizuje szanse zatrudnienia na oferowane stanowisko.
        4. Jeśli zauważysz brakujące informacje, które mogą zwiększyć dopasowanie CV, dodaj je samodzielnie.
        
        Proszę, podaj odpowiedź jako tekst w odpowiednich znacznikach HTML (<h5>, <p>, <b>, <li>), bez dodatkowych znaków HTML.
        
        Dane wejściowe:
        - Obecne CV: ${cvJobVal}
        - Ogłoszenie o pracę: ${rekJobVal}
        - Analiza dopasowania CV do ogłoszenia: ${rekJobRecomVal}
        - Dodatkowe informacje do analizy: ${addedContext}
        
        Odpowiedź proszę podać w języku: ${lang}.
        `        

        //content: "Na podstawie danych obecnego CV, ogłoszenia o pracę oraz podsumowania analizy dopasowania ogłoszenia do obecnego CV, przygotuj rozbudowaną propozycję pełnego brzmienia najepiej dopasowanego CV. W odpowiedzi uwzględnij wszystkie posiadane informacje odnosnie historii zatrudnienia, wykształcenia, doświadczenia, edukacji oraz informacji dodatkowych. Informacje zawarte w obecnym CV rozbuduj wprowadzając korekty dodając informacje sugerowane przez analize dopasowania ogłoszenia do CV. Przygotuj odpowiedz tak, aby propozycja zawartości CV była odpowiednio rozbudowana, zwiększała szanse zatrudnienia na ogłoszenie o pracę i zawierała te informacje, które powinny znaleść się w ostatecnej wersji dokumentu CV. Odpowiedź podaj jako tekst w odpowiednich znacznikach <h5>, <p>, <b> oraz <li> bez żadnych dodatkowych znaków html. Jeżeli uważasz, że nalezy dodac jakies informacje których brak w obecnym CV - dodaj je. Odpowiedż podaj w języku " + lang + ". Obecne CV: " + cvJobVal + " , ogłoszenie o pracę: " + rekJobVal + " , analiza dopasowania ogłoszenia do CV: " + rekJobRecomVal
        //content: "Na podstawie danych mojego CV, podsumowania ogłoszenia o pracę oraz Podsumowanie analizy dopasowania CV do ogłoszenia przygotuj propozycję pełnego brzmienia najepiej dopasowanego CV. W odpowiedzi uwzględnij wszystkie posiadane informacje odnosnie wykształcenia, doświadczenia, edukacji oraz informacji dodatkowych skorygowanych zgodnie z analizą dopasowania. Odpowiedź podaj jako kod html. Możesz dołączyć style. Jeżeli uważasz, że nalezy dodac jakies informacje których brak w żródłowym CV - dodaj je. Obecne CV :" + cvJobVal + " ogłoszenie o pracę: " + rekJobVal + "analiza dopasowania ogłoszenia do CV: " + rekJobRecomVal
      }]
    });

    if (timedOut) return; // Jeśli funkcja już przekroczyła czas, przerywamy wykonywanie

    const summaryOpenAi = completion.choices[0].message.content;
    console.log("Podsumowanie: " + summaryOpenAi);

    const updates = {
      cvRecommended: summaryOpenAi,
      cvRecommendedHTML: 1,
      cvRecommendedTimeout: 0
    };

    await admin.database().ref(`cvBuddy/${uidSave}/cvProject/${position}`).update(updates);

    const checkLimitRef = admin.database().ref(`secdata/${uidSave}/personal/checkLmLimit`);
    try {
      await checkLimitRef.transaction(currentValue => {
        return (currentValue || 0) + 1;
      });
    } catch (error) {
      console.error('Error incrementing check limit:', error);
    }
  } catch (error) {
    console.error('Error processing request:', error);
  } finally {
    clearTimeout(timeoutHandler); // Wyczyszczenie timera po zakończeniu funkcji
  }
});


exports.setCompleted = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Użytkownik musi być zalogowany, aby wywołać tę funkcję.'
    );
  }

  const uidSave = context.auth.uid;
  const position = data.positionid;
  const completedSet = data.completed
  
  try {

    const updates = {
      completed: completedSet
    };

    await admin.database().ref(`cvBuddy/${uidSave}/cvProject/${position}`).update(updates);
  } catch (error) {
    console.error('Error processing request:', error);
  }
});

exports.setImageStyle = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Użytkownik musi być zalogowany, aby wywołać tę funkcję.'
    );
  }

  const uidSave = context.auth.uid;
  const selectedImageStyle = data.selectedImageStyle;
  const parametersActiveVal = 1;
  
  
  try {

    const updates = {
      selectedImageStyle,
      parametersActiveVal

    };

    await admin.database().ref(`secdata/${uidSave}/personal`).update(updates);
  } catch (error) {
    console.error('Error processing request:', error);
  }
});

exports.saveAssistantName = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Użytkownik musi być zalogowany, aby wywołać tę funkcję.'
    );
  }

  const uidSave = context.auth.uid;
  const assistantName = data.AssistantName;
  const parametersActiveVal = 1;
  
  
  try {

    const updates = {
      assistantName,
      parametersActiveVal

    };

    await admin.database().ref(`secdata/${uidSave}/personal/`).update(updates);
  } catch (error) {
    console.error('Error processing request:', error);
  }
});

exports.setResign = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Użytkownik musi być zalogowany, aby wywołać tę funkcję.'
    );
  }

  const uidSave = context.auth.uid;
  const position = data.positionid;
  const ResignSet = data.resign
  
  try {

    const updates = {
      resign: ResignSet
    };

    await admin.database().ref(`cvBuddy/${uidSave}/cvProject/${position}`).update(updates);
  } catch (error) {
    console.error('Error processing request:', error);
  }
});

      
exports.cvGeneratedRecommendCv = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Użytkownik musi być zalogowany, aby wywołać tę funkcję.'
    );
  }

  const insideDiscoveryAttach = data.insideDiscoveryAttach;
  const lmAttach = data.lmAttach;
  const uidSave = context.auth.uid;
  const position = data.positionid;
  const lang = data.lang;
  const templ = data.templ;
  //const cvPathJob = `cvBuddy/${uidSave}/cv/response`;
  const lmPathSum = `cvBuddy/${uidSave}/cvProject/${position}/cvLm`;
  const rekPathRecomendation = `cvBuddy/${uidSave}/cvProject/${position}/cvRecommended`;
  const cvTemplate = `cvBuddy/conf/templates/${templ}`;
  const storagePath = `cvBuddy/${uidSave}/generatedCV/${position}/generatedCV.docx`;

  let insightSummary = '';

  try {
    if (insideDiscoveryAttach === true) {
      // Pobierz najnowszy wynik testu Insight Discovery
      const insightsRef = admin.database().ref(`/Neuroinsights/${uidSave}/InsightDiscovery`).orderByChild('date').limitToLast(1);
      const snapshot = await insightsRef.once('value');
      const latestInsight = snapshot.val();

      if (latestInsight) {
        const key = Object.keys(latestInsight)[0];
        const comment = latestInsight[key].comment;
        const explanations = latestInsight[key].wyjasnienia; // zakładając, że są 4 pola

        // Tworzenie treści podsumowania Insight Discovery
        insightSummary = `
          <h2>Podsumowanie wyników testu Insight Discovery Self Check</h2>
          ${comment}
          <h3>Dodatkowe wyjaśnienia (kolory)</h3>
        `;

        Object.keys(explanations).forEach(explanationKey => {
          insightSummary += `
            <h6>${explanationKey}</h6>
            <p>${explanations[explanationKey]}</p>
          `;
        });
      }
    } else {
      insightSummary = '';
    }

    // Pobierz dane z Firebase Realtime Database
    //const cvJobSnapshot = await admin.database().ref(cvPathJob).once('value');
    const lmPathSumnapshot = await admin.database().ref(lmPathSum).once('value');
    const rekRecSnapshot = await admin.database().ref(rekPathRecomendation).once('value');
    const cvTemplateSnapshot = await admin.database().ref(cvTemplate).once('value');

    //const cvJobVal = cvJobSnapshot.val();
    const lmPathSumVal = lmPathSumnapshot.val();
    const rekJobRecomVal = rekRecSnapshot.val();
    const cvTemplateVal = cvTemplateSnapshot.val();

    let lmAttachReq = "";
    if (lmAttach === true) {
      //lmAttachReq = ` Na początku dokumentu, zaraz po znaczniku <body> a przed <!-- Header Section --> w szablonie, umieść w div wartość listu motywacyjnego dopasowując formatowanie do szablonu. List motywacyjny: ${lmPathSumVal}`;
      lmAttachReq = lmPathSumVal;
    } else {
      lmAttachReq = "";
    }

    // Wygeneruj treść CV przy użyciu OpenAI
    const completion = await openai.chat.completions.create({
      model: "o1-mini-2024-09-12",
      messages: [{
        role: "user",
        content: "Na podstawie propozycji danych do CV przygotuj dokument CV w HTML zgodnie z podanym szablonem CV. Wykorzystaj wszystkie informacje zawarte w opracowanej zawartości nowego CV dodając ewentualne sekcje lub pozycje które nie występują w szablonie. Możesz dodać sekcje jeżeli nie występują w szablonie, np ogólne podsumowanie na początku w pełnym brzmieniu. Ilość pozycji i zawartość musi być zgodna z informacjami w opracowanej zawartości nowego CV. Odpowiedź podaj w języku " + lang + ". Opracowana zawartość nowego CV: " + rekJobRecomVal + ", szablon CV: " + cvTemplateVal + " Odpowiedź podaj wyłącznie w formacie HTML, bez dodawania jakichkolwiek dodatkowych znaków na początku ani na końcu."
      }]
    });

    const summaryOpenAi = completion.choices[0].message.content;

    const updates = {
      cvGenerated: summaryOpenAi
    };
let summaryOpenAiReq = summaryOpenAi;
    // Dodaj lmAttachReq za znacznikiem <body> i przed <!-- Header Section -->
    summaryOpenAiReq = summaryOpenAiReq.replace(
  /<body>([\s\S]*?)<!-- Header Section -->/,
  `<body>$1<div>${lmAttachReq}</div><!-- Header Section -->`
);

// Dodaj insightSummary tuż przed zamknięciem znacznika </body>
summaryOpenAiReq = summaryOpenAiReq.replace(
  /<\/body>/,
  `<div>${insightSummary}</div></body>`
);

    //const timestampFile = admin.database.ServerValue.TIMESTAMP

    // Wyślij dane do wskazanego endpointu i odbierz link do pliku (w formacie tekstowym)
    const response = await fetch('https://hook.eu1.make.com/chli1ws8vi0kdhuth4o30uclirhuabqp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ htmlContent: summaryOpenAiReq })
    });

    const downloadUrl = await response.text(); // Pobierz link do pliku jako tekst (plik .docx)

    // Pobierz plik .docx z podanego URL
    const fileResponse = await fetch(downloadUrl);
    const fileBuffer = await fileResponse.buffer(); // Odbierz plik jako buffer

    // Zapisz plik .docx w Firebase Storage
    const bucket = admin.storage().bucket();
    const file = bucket.file(storagePath);
    await file.save(fileBuffer, {
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Ustaw odpowiedni typ MIME
    });

    // Uzyskaj link do pobrania pliku z Firebase Storage
    // Zastąp użycie `getSignedUrl` tym kodem po zapisie pliku
    //const fileDownloadUrl = await file.getDownloadURL(); // Uzyskaj publiczny URL pliku

    const fileDownloadUrl = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500' // Możesz ustawić inną datę wygaśnięcia linku
    });

    console.log('Plik .docx zapisany w Firebase Storage:', storagePath);
    console.log('Link do pobrania pliku:', fileDownloadUrl[0]);

    // Zapisz link do pliku w Firebase Realtime Database
    await admin.database().ref(`cvBuddy/${uidSave}/cvProject/${position}`).update({
      cvDownloadLink: fileDownloadUrl[0], 
      cvGeneratedStatus: 1, // Zapisz link do pliku
      ...updates
    });

    // Zaktualizuj limit dla użytkownika
    const checkLimitRef = admin.database().ref(`secdata/${uidSave}/personal/checkLmLimit`);
    try {
      await checkLimitRef.transaction(currentValue => {
        return (currentValue || 0) + 1;
      });
    } catch (error) {
      console.error('Error incrementing check limit:', error);
    }
  } catch (error) {
    console.error('Error processing request:', error);
  }
});


exports.processExtractedText = functions.region('europe-central2').firestore.document('/extractedText/{docId}').onCreate(async (snapshot, context) => {
  // Pobieramy dane z dokumentu
  const data = snapshot.data();

  // Sprawdzamy, czy pola "file" i "text" istnieją w danych
  if (data && data.file && data.text) {
    // Pobieramy uidSave z pola "file"
    const filePath = data.file;
    const parts = filePath.split('/');
    const fileName = parts[5];
    const uidSave = parts[4]; // uidSave znajduje się na indeksie 3 po podziale ścieżki przez "/"



    // Wyświetlamy dane na konsoli
    console.log('uidSave:', uidSave);
    console.log('File:', data.file);
    console.log('Text:', data.text);

    // Zapisujemy odpowiedź w realtime database w ścieżce /docusecai/uidSave/response
    const ref = db.ref('docusecai/' + uidSave).push({
      //fileContentVerbose: 'Trwa transkrypcja i wstępna analiza',
      response: data.text,
      fileName: fileName,
      filePath: filePath,
      date: admin.database.ServerValue.TIMESTAMP,
      status: "processing"
    });
    const anyUniqueId = ref.key;
    console.log('Wygenerowany unikalny identyfikator:', anyUniqueId);
    console.log('Data saved successfully.');


    //tutaj dalsze przetwarzanie na AI

    try {
      const completion = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
        model: "gpt-4o-mini-2024-07-18",
        messages: [{ role: "user", content: "Przeanalizuj treść okreslając typ dokumentu oraz krótko podsumuj podając najwazniejsze informacje. Odpowiedz podaj w tagach html: " + data.text }],
        temperature: 1,
      });
      const summaryOpenAi = completion.choices[0].message.content;
      console.log("Podsumowanie: " + summaryOpenAi);
      // Użyj:
      const updates = {
        docuAiShort: summaryOpenAi.replace(/\n/g, "<br/>"),
        status: "processed",
        statusAi: "processed"
      };

      db.ref('docusecai/' + uidSave + '/' + anyUniqueId).update(updates);

    } catch (error) {
      // Handle the error
      console.error('Error processing request:', error);
    }




  }
});

exports.processDocx = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).storage.object().onFinalize(async (object) => {
  const filePath = object.name;

  // Sprawdzamy, czy plik to *.docx i czy jest w ścieżce /legal/
  if (filePath.startsWith('legal/') && filePath.endsWith('.docx')) {

    const parts = filePath.split('/');
    const uidSave = parts[1]; // Get the uidSave
    const fileName = parts[2];
    console.log(filePath);

    // Pobieramy plik z Storage do tymczasowego pliku na serwerze Firebase
    const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
    await admin.storage().bucket().file(filePath).download({ destination: tempFilePath });

    try {
      // Odczytaj zawartość pliku DOCX
      const content = await fs.readFile(tempFilePath);

      // Wczytaj plik DOCX jako obiekt PizZip
      const zip = new PizZip(content);
      const doc = new Docxtemplater().loadZip(zip);

      // Wykonaj renderowanie szablonu
      doc.render();
      //const paragraphs = doc.getFullText('paragraphs');
      //const extractedText = JSON.stringify(paragraphs);


      // Pobierz wynikowy tekst z pliku DOCX
      const extractedText = doc.getFullText();
      console.log(extractedText);

      // Zapisujemy odpowiedź w realtime database w ścieżce /docusecai/uidSave/response
      const ref = db.ref('docusecai/' + uidSave).push({
        //fileContentVerbose: 'Trwa transkrypcja i wstępna analiza',
        response: extractedText,
        fileName: fileName,
        filePath: filePath,
        date: admin.database.ServerValue.TIMESTAMP,
        status: "processing"
      });
      const anyUniqueId = ref.key;
      console.log('Wygenerowany unikalny identyfikator:', anyUniqueId);
      console.log('Data saved successfully.');

      // Tutaj kontynuujesz przetwarzanie na AI i aktualizację wpisu w bazie danych

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini-2024-07-18",
          messages: [{ role: "user", content: "Przeanalizuj treść określając typ dokumentu oraz podsumuj podając najważniejsze informacje : " + extractedText }],
          temperature: 1,
        });
        const summaryOpenAi = completion.choices[0].message.content;
        console.log("Podsumowanie: " + summaryOpenAi);
        // Użyj:
        const updates = {
          docuAiShort: summaryOpenAi.replace(/\n/g, "<br/>"),
          status: "processed",
          statusAi: "processed"
        };

        db.ref('docusecai/' + uidSave + '/' + anyUniqueId).update(updates);

      } catch (error) {
        // Handle the error
        console.error('Error processing request:', error);
      }

      return null;

    } catch (error) {
      console.error('Błąd podczas przetwarzania pliku DOCX:', error);
      throw new Error('Błąd podczas przetwarzania pliku DOCX.');
    } finally {
      // Usuwamy tymczasowy plik po przetworzeniu lub w przypadku błędu
      unlinkSync(tempFilePath);
    }
  }
});

exports.fetchData = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  const uidSave = data.uidSave;
  console.log("uidSave: " + uidSave);
  if (!uidSave) {
    console.log("brak uidSave " + uidSave);
    throw new functions.https.HttpsError('unauthenticated', 'Musisz być zalogowany, aby wykonać tę operację.');
  }

  const dbRef = admin.database().ref();
  const results = [];

  // Równoległe pobieranie danych z transcriptions, tasksai i docuseai
  const transcriptionsPromise = dbRef.child(`transcriptions/${uidSave}`).once('value');
  const tasksaiPromise = dbRef.child(`tasksai/${uidSave}`).once('value');
  const docuseaiPromise = dbRef.child(`cvBuddy/${uidSave}/cvProject`).once('value');

  const [transcriptionsSnapshot, tasksaiSnapshot, docuseaiSnapshot] = await Promise.all([transcriptionsPromise, tasksaiPromise, docuseaiPromise]);

  // Przetwarzanie wyników z transcriptions
  transcriptionsSnapshot.forEach(childSnapshot => {
    const key = childSnapshot.key;
    const { date, title } = childSnapshot.val();
    results.push({ date, title, key, type: 'gathermind' });
  });

  // Przetwarzanie wyników z tasksai
  tasksaiSnapshot.forEach(childSnapshot => {
    const key = childSnapshot.key;
    const { timestamp: timestampString, tekst2 } = childSnapshot.val();
    const timestamp = new Date(timestampString).getTime();
    results.push({ date: timestamp, title: tekst2, key, type: 'detaskify' });
  });

  // Przetwarzanie wyników z docuseai
  docuseaiSnapshot.forEach(childSnapshot => {
    const key = childSnapshot.key;
    const { date, title } = childSnapshot.val();
    results.push({ date, title, key, type: 'docusec' });
  });

  // Sortowanie wyników rosnąco
  results.sort((a, b) => b.date - a.date);

  // Ograniczenie liczby wyników do 10
  const limitedResults = results.slice(0, 10);

  //console.log(limitedResults);
  //console.log(results);

  return limitedResults;
});

// Monitor new transcription files (.txt)
exports.DEMOmonitorTranscriptionUpload = functions.region('europe-west1').runWith({ timeoutSeconds: 540 }).storage.object().onFinalize(async (object) => {
  const filePath = object.name; // File path in Firebase Storage

  // Check if the file is a transcription file
  if (filePath.startsWith('demo/audio') && filePath.endsWith('.m4a.wav_transcription.txt')) {
    const parts = filePath.split('/');
    if (parts.length === 4) { // The path should look like "audio/{uidSave}/{typeTask}/{filename}"


      const emailencoded = parts[2]; // Get the uidSave
      //const typeTask = parts[2];
      const fileName = parts[3];
      const emaildecoded = atob(emailencoded);
      const filePathM4a = filePath.replace(/\.wav_transcription\.txt$/, "");
      const fileNameMp4 = fileName.replace(/\.wav_transcription\.txt$/, "");
      console.log(filePathM4a);


      // Get a reference to the file in Firebase Storage
      const bucket = storage.bucket(object.bucket);
      const file = bucket.file(filePath);

      try {
        const data = await file.download();
        const fileContent = data[0].toString('utf8');  // Convert the file content to a string

        // Parse the file content as JSON
        let fileContentJSON;
        try {
          fileContentJSON = JSON.parse(fileContent);
        } catch (error) {
          console.error('Error parsing file content:', error);
          return;
        }

        // Extract the transcript from the parsed JSON
        let transcript = '';
        if (Array.isArray(fileContentJSON.results)) {
          fileContentJSON.results.forEach(result => {
            if (Array.isArray(result.alternatives)) {
              result.alternatives.forEach(alternative => {
                transcript += alternative.transcript + ' ';
              });
            }
          });
        }

        // Check if the transcript is not empty
        if (transcript.trim() !== '') {


          // Konwersja transkrypcji na żądany format JSON
          const convertedTranscription = fileContentJSON.results.map((result, index) => {
            const end = parseFloat(result.resultEndTime.replace("s", ""));
            const text = result.alternatives[0].transcript;

            return { end, text };
          });
          const transcriptedVerbose = JSON.stringify(convertedTranscription, null, 2);
          // Wyświetlenie przekonwertowanej transkrypcji
          // console.log(transcriptedVerbose);

          // Update the entry with file content and set 'transcripted' to true
          let data = convertedTranscription;
          let lastEndValue = data[data.length - 1].end;
          let timeInSec = lastEndValue;

          console.log(transcriptedVerbose);
          console.log(toHHMMSS(timeInSec));
          console.log(emaildecoded);



          const file = admin.storage().bucket().file(filePathM4a);
          // console.log('wielkość pliku: ' + file.size);


          const tempLocalFile = path.join(os.tmpdir(), fileNameMp4);
          await file.download({ destination: tempLocalFile });
          //const configurationWhisper = new Configuration({
          //  apiKey: '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', // Use your API key
          //});
          const openaiWhisper = new OpenAINew();



          const transcriptopenai = await openaiWhisper.createTranscription(
            fsdemo.createReadStream(tempLocalFile),
            "whisper-1",
            'Nagranie spotkania',
            'verbose_json',
            0.2,
          );
          // Tutaj kontynuuj przetwarzanie transkrypcji



          var transcriptOpenAiWork = transcriptopenai.data.text;
          var transcriptOpenAi = transcriptOpenAiWork.replace(/\n/g, "<br/>");
          console.log('Transkrypcja openAI: ' + transcriptOpenAi);

          // Clean up temp directory
          fsdemo.unlinkSync(tempLocalFile);


          const completion = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
            model: "gpt-4o-mini-2024-07-18",
            messages: [{ role: "user", content: "Rozwiń oraz podsumuj: " + transcriptedVerbose }],
            temperature: 1,
          });
          const summaryOpenAi = completion.choices[0].message.content;
          console.log("SummaryOpenAi fragment: " + summaryOpenAi);


          const summaryDemo = summaryOpenAi.replace(/\n/g, "<br/>");


          // Tworzenie referencji do kolekcji
          const transcriptionsRef = dbf.collection('democontent');

          // Dodawanie nowego dokumentu z danymi
          transcriptionsRef.add({
            transcriptOpenAi: transcriptOpenAi,
            category: 'demotrans',
            to: emaildecoded,
            summaryDemo: transcriptedVerbose,
            summary: summaryDemo
          }).then((docRef) => {
            console.log('Document written with ID:', docRef.id);
          }).catch((error) => {
            console.error('Error adding document:', error);
          });

          var datatrans = {
            category: "demotrans",
            transcriptOpenAi: transcriptOpenAi,
            to: emaildecoded,
            summary: summaryDemo,
            summaryDemo: transcriptedVerbose,
          };
          // Wyślij dane do wskazanego endpointu
          fetch('https://hook.eu1.make.com/orzxol449aa4x9unyr8ekhv6r0595o7o', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(datatrans)
          })






        } else {
          console.error('Transcript is empty.');
        }
      } catch (error) {
        console.error('Error downloading file.', error);
      }
    }
  }
});


// Funkcja, która zostanie wywołana przy zapisie pliku *.pdf w ścieżce /legal/
exports.DEMOprocessPDF = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).storage.object().onFinalize(async (object) => {
  const filePath = object.name;



  // Sprawdzamy, czy plik to *.pdf i czy jest w ścieżce /legal/
  if (filePath.startsWith('demo/docusec/') && filePath.endsWith('.pdf')) {

    const parts = filePath.split('/');

    const emailencoded = parts[2]; // Get the uidSave
    //const typeTask = parts[2];
    const fileName = parts[3];
    const emaildecoded = atob(emailencoded);


    // Pobieramy plik z Storage do tymczasowego pliku na serwerze Firebase
    const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
    await admin.storage().bucket().file(filePath).download({ destination: tempFilePath });

    // Sprawdzamy, czy plik to poprawny plik PDF
    const isValidPDF = await checkValidPDF(tempFilePath);
    if (!isValidPDF) {
      console.error('Niepoprawny format pliku PDF:', filePath);
      // Usuwamy tymczasowy plik po przetworzeniu
      unlinkSync(tempFilePath);
      return null;
    }

    // Wysyłamy plik *.pdf na endpoint przy użyciu biblioteki axios
    const endpoint = 'https://hook.eu1.make.com/njficz86yqtkmqb6c05cm0ecgclwqg3j';
    const formData = new FormData();
    formData.append('file', createReadStream(tempFilePath));
    formData.append('docuseclimit', "5");

    try {
      const response = await axios.post(endpoint, formData, {
        headers: formData.getHeaders(),
      });

      //tutaj dalsze przetwarzanie na AI


      const completion = await openai.chat.completions.create({ // Wywołanie API OpenAI za pomocą klienta openai
        model: "gpt-4o-mini-2024-07-18",
        messages: [{ role: "user", content: "Określ typ dokumentu, podsumuj oraz sczegółowo przeanalizuj podając najwazniejsze informacje zawarte w dokumencie. Jeżeli analizowana treść jest Umową, wskaż najwazniejsze punkty w Umowie oraz wskaż strony Umowy. Określ również, jeżeli treśc jest Umową, czy Umowa gwarantuje równość stron.  Jeżeli analizowana treść nie jest Umową, podaj szczegółowe informacje i wnioski. Odpowiedz podaj w tagach html: " + response.data }],
        temperature: 1,
      });
      const summaryOpenAi = completion.choices[0].message.content;
      console.log("Podsumowanie: " + summaryOpenAi);
      const summaryDemo = summaryOpenAi.replace(/\n/g, "<br/>");

      // Tworzenie referencji do kolekcji
      const transcriptionsRef = dbf.collection('democontent');

      // Dodawanie nowego dokumentu z danymi
      transcriptionsRef.add({
        category: 'demopdf',
        to: emaildecoded,
        summary: summaryDemo
      }).then((docRef) => {
        console.log('Document written with ID:', docRef.id);
      }).catch((error) => {
        console.error('Error adding document:', error);
      });


      var data = {
        category: "demopdf",
        to: emaildecoded,
        summary: summaryDemo
      };
      // Wyślij dane do wskazanego endpointu
      fetch('https://hook.eu1.make.com/orzxol449aa4x9unyr8ekhv6r0595o7o', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })




    } catch (error) {
      console.error('Błąd podczas wysyłania pliku na endpoint:', error);

      throw new Error('Błąd podczas wysyłania pliku na endpoint.');
    }



    // Usuwamy tymczasowy plik po przetworzeniu
    unlinkSync(tempFilePath);

    return null;
  }
});


exports.updateRegistrations = functions.runWith({ timeoutSeconds: 540 }).https.onRequest(async (req, res) => {
  // Pobieranie referencji do Realtime Database
  const dbRef = admin.database().ref('/surveys');

  // Pobieranie wszystkich kluczy z ścieżki \surveys
  const snapshot = await dbRef.once('value');
  const keys = Object.keys(snapshot.val() || {});

  // Pobieranie referencji do Firestore
  const firestore = admin.firestore();

  // Iteracja przez wszystkie klucze
  for (const key of keys) {
    // Pobieranie wartości email z kolekcji customers dla danego klucza
    const customerDoc = await firestore.collection('customers').doc(key).get();
    const email = customerDoc.data()?.email || '';

    // Pobieranie wartości comment z Realtime Database
    const commentSnapshot = await dbRef.child(`${key}/comment`).once('value');
    const comment = commentSnapshot.val() || '';

    // Dodawanie/aktualizowanie dokumentu w kolekcji registrations
    await firestore.collection('registrations').doc(key).set({
      adhdtest: "adhdtest",
      emailAddress: email,
      uidSave: key,
      adhdcomment: comment
    }, { merge: true }); // Opcja merge: true zapewnia, że dokument zostanie zaktualizowany, jeśli już istnieje
  }

  console.log(keys.length);
  // Wysyłanie odpowiedzi
  res.send(`Zaktualizowano ${keys.length} dokumentów w kolekcji registrations.`);
});


exports.monitorComments = functions.region('europe-west1').database.ref('surveys/{uid}/comment').onWrite(async (change, context) => {
    const uid = context.params.uid;

    // Sprawdź, czy to nowy wpis, aktualizacja czy usunięcie
    if (!change.before.exists() && change.after.exists()) {
      console.log('New comment created.');
    } else if (change.before.exists() && change.after.exists()) {
      console.log('Comment updated.');
    } else if (change.before.exists() && !change.after.exists()) {
      console.log('Comment deleted.');
      return null; // Jeśli komentarz został usunięty, możemy zakończyć funkcję tutaj
    }

    // Pobierz nową wartość komentarza
    const comment = change.after.val();

    // Pobierz e-mail użytkownika z Firestore
    const doc = await admin.firestore().collection('customers').doc(uid).get();
    //const email = "mariusz.duszczyk@adhdbuddy.me";
    const email = doc.data().email;

    // Wyświetl wartości w logach
    //console.log(`UID: ${uid}`);
    //console.log(`Comment: ${comment}`);
    //console.log(`Email: ${email}`);

    //var datatranssurvey = {
    //  category: "afterAdhdTest",
    //  summary: comment,
    //  to: email,
    // };

    // Wyślij dane do wskazanego endpointu
    //fetch('https://hook.eu1.make.com/orzxol449aa4x9unyr8ekhv6r0595o7o', {
    //  method: 'POST',
    //  headers: {
    //    'Content-Type': 'application/json'
    //  },
    //  body: JSON.stringify(datatranssurvey)
    // });

    /** add a new mail document */
    await admin.firestore().collection("mail").add({
      to: email,
      template: {
        name: "adhdstandardmail",
        data: {
          comment: comment,
        },
      },
    });
  });

exports.stripeWebhook = functions.https.onRequest((request, response) => {
  // Pobierz sygnaturę webhooka z nagłówków żądania
  let sig = request.headers["stripe-signature"];

  let event;

  try {
    // Weryfikuj sygnaturę webhooka
    event = stripe.webhooks.constructEvent(request.rawBody, sig, 'whsec_9Ped2zPuvdXfVKiBKK2fdAFMT1gIadF4');
  } catch (err) {
    // Jeśli weryfikacja sygnatury się nie powiedzie, zwróć błąd
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Obsłuż różne typy zdarzeń Stripe
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const charge = paymentIntent.charges.data[0]; // Pobranie pierwszej opłaty związanej z PaymentIntent
      const email = charge.billing_details.email; // Pobranie adresu e-mail
      const wartosc = paymentIntent.amount;
      console.log(`PaymentIntent was successful! ID: ${paymentIntent.id}, Email: ${email}, amount: ${wartosc}`);

      if (wartosc === 4900) {
        // Kod do wykonania, jeśli amount wynosi 4900
        const mailFinal = ``;
        sendDataToEndpoint(email, mailFinal, 'sendAddTest');
        console.log("Amount wynosi 4900");
      } else {
        // Kod do wykonania, jeśli amount nie wynosi 4900
        console.log("Amount nie wynosi 4900");
      }



      break;
    // Dodaj tutaj inne typy zdarzeń, które chcesz obsłużyć
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Zwróć odpowiedź, że wszystko poszło dobrze
  response.status(200).send('Success');
});

exports.getSubscriptionStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const userId = context.auth.uid;
  console.log("user ID: " + userId);

  // Pobierz dokument użytkownika z Firestore
  const userDoc = await admin.firestore().collection('customers').doc(userId).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'User document not found.');
  }

  const userData = userDoc.data();
  const subscription = userData.subscription;
  //console.log ("Dane z subskrypcji: " + subscription.status);
  if (subscription && subscription.status) {
    // Zwróć dane subskrypcji
    return {
      status: subscription.status,
      current_period_end: subscription.current_period_end,
      plan: subscription.plan,
    };
  } else {
    // Jeśli brak subskrypcji
    return { status: 'no_subscription' };
  }
});


exports.createCheckoutSessionProduct = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const userId = context.auth.uid;
  const userDoc = await admin.firestore().collection('customers').doc(userId).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'User document not found.');
  }

  const stripeCustomerId = userDoc.data().stripeId;
  const priceId = data.priceId; // Pobranie priceId z danych przesyłanych z klienta
  const successUrl = data.successUrl; // Pobranie successUrl z argumentów
  const cancelUrl = data.cancelUrl; // Pobranie cancelUrl z argumentów

  if (!priceId || !successUrl || !cancelUrl) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with valid priceId, successUrl, and cancelUrl.');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'p24', 'blik'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer: stripeCustomerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return { id: session.id };
});

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const userId = context.auth.uid;
  const userDoc = await admin.firestore().collection('customers').doc(userId).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'User document not found.');
  }

  const stripeCustomerId = userDoc.data().stripeId;
  const priceId = data.priceId; // Pobranie priceId z danych przesyłanych z klienta
  const successUrl = data.successUrl; // Pobranie successUrl z argumentów
  const cancelUrl = data.cancelUrl; // Pobranie cancelUrl z argumentów

  if (!priceId || !successUrl || !cancelUrl) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with valid priceId, successUrl, and cancelUrl.');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    customer: stripeCustomerId,
    subscription_data: {
      trial_period_days: 3,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return { id: session.id };
});

exports.checkUserPaidTests = functions.region('europe-central2').https.onCall(async (data, context) => {
  const uid = data.uid;

  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID is required.');
  }

  try {
    const testRef = admin.database().ref(`/testsUnpaid/${uid}/ADHDFullTest`);
    const snapshot = await testRef.once('value');

    if (!snapshot.exists()) {
      return { status: 'noPaidTests' };
    }

    const testDates = [];
    snapshot.forEach(recordSnapshot => {
      const recordData = recordSnapshot.val();
      if (recordData.date) {
        testDates.push(recordData.date);
      }
    });

    return { status: 'hasPaidTests', dates: testDates };
  } catch (error) {
    console.error('Error fetching test data:', error);
    throw new functions.https.HttpsError('unknown', 'Error fetching test data:', error.message);
  }
});

exports.checkUserPaidTestsInsightDiscovery = functions.region('europe-central2').https.onCall(async (data, context) => {
  const uid = data.uid;

  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID is required.');
  }

  try {
    const testRef = admin.database().ref(`/testsUnpaid/${uid}/InsightDiscovery`);
    const snapshot = await testRef.once('value');

    if (!snapshot.exists()) {
      return { status: 'noPaidTests' };
    }

    const testDates = [];
    snapshot.forEach(recordSnapshot => {
      const recordData = recordSnapshot.val();
      if (recordData.date) {
        testDates.push(recordData.date);
      }
    });

    return { status: 'hasPaidTests', dates: testDates };
  } catch (error) {
    console.error('Error fetching test data:', error);
    throw new functions.https.HttpsError('unknown', 'Error fetching test data:', error.message);
  }
});

exports.createCustomerPortalLink = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const userId = context.auth.uid;
  const userDoc = await admin.firestore().collection('customers').doc(userId).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'User document not found.');
  }

  const stripeCustomerId = userDoc.data().stripeId;
  const returnUrl = data.returnUrl; // Pobranie returnUrl z argumentów

  if (!returnUrl) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid returnUrl.');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl, // Użycie dynamicznego returnUrl
  });

  return { url: session.url };
});

exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, 'whsec_KKfG8lcGw9bLzISwYMQLHAhpPPgW7nnN');
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }

  const session = event.data.object;

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(session);
      break;
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(session);
      break;
    case 'customer.subscription.created':
      await handleSubscriptionCreated(session);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(session);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

exports.monitorSubscriptionChanges = functions.firestore.document('customers/{userId}').onUpdate((change, context) => {
    const userId = context.params.userId;
    const newValue = change.after.data();
    const subscription = newValue.subscription;

    let activeStatus = 0;

    if (subscription && subscription.status) {
      if (subscription.status === 'trialing' || subscription.status === 'active') {
        activeStatus = 1;
      }
    }

    return admin.database().ref(`secdata/${userId}/personal/activeCv`).set(activeStatus);
  });

exports.monitorSubscriptionDeletions = functions.firestore.document('customers/{userId}').onDelete((snapshot, context) => {
    const userId = context.params.userId;
    return admin.database().ref(`secdata/${userId}/personal/activeCv`).set(0);
  });


exports.testAdhdTestResut = functions.runWith({ timeoutSeconds: 540 }).database.ref('ADHDFull/{uidSaveId}').onUpdate(async (change, context) => {
    const beforeData = change.before.val(); // dane przed zmianą
    const afterData = change.after.val();  // dane po zmianie

    // Sprawdzamy, czy status został zmieniony z 0 na 1
    if (afterData.status === 1 && beforeData.status === 0) {
      console.log(`UID: ${context.params.uidSaveId}`);
      // Pobierz e-mail użytkownika z Firestore
      const doc = await admin.firestore().collection('customers').doc(context.params.uidSaveId).get();
      const email = doc.data().email;
      console.log(email);

      console.log(`Status: ${afterData.status}`);
      console.log('-------------------------');

      let contentPart1, contentPart2, contentPart3;

      const promptAdult = 'Przeanalizuj podane pytania i odpowiedzi w kontekście diagnozy ADHD. Przygotuj rozbudowane i szczegółowe podsumowanie analizy wieku dorosłego. Skup się na odpowiedziach wieku dorosłego. Użyj języka profesjonalnego i odwołuj się do metodologii badawczych dotyczących ADHD. Każdy punkt analizy rozbuduj i powołaj się na wskazania diagnostyczne zgodne z dsm-5. jeżeli odpowiedzi sprawiają wrażenie losowych, wskaż to w podsumowaniu. Pytania i odpowiedzi dotyczą tej samej dorosłej osoby: ' + afterData.surveypartAdult + ' Pytania i odpowiedzi osoby badanej dotyczącej okresu dzieciństwa: ' + afterData.surveypartYoung;
      const promptYoung = 'Przeanalizuj podane pytania i odpowiedzi w kontekście diagnozy ADHD. Przygotuj rozbudowane i szczegółowe podsumowanie analizy objawów z czasów dzieciństwa w odniesieniu do objawów wieku dorosłego. Skup się na odpowiedziach dotyczących okresu dzieciństwa. Użyj języka profesjonalnego i odwołuj się do metodologii badawczych dotyczących ADHD. Każdy punkt analizy rozbuduj i powołaj się na wskazania diagnostyczne zgodne z dsm-5. jeżeli odpowiedzi sprawiają wrażenie losowych, wskaż to w podsumowaniu. Pytania i odpowiedzi dotyczą tej samej dorosłej osoby: ' + afterData.surveypartAdult + ' Pytania i odpowiedzi osoby badanej dotyczącej okresu dzieciństwa: ' + afterData.surveypartYoung;
      const promptFinal = 'Przeanalizuj podane pytania i odpowiedzi w kontekście diagnozy ADHD. Przygotuj rozbudowane i szczegółowe podsumowanie analizy łącząc objawy w wieku dorosłym uwzględniając trwanie bądź nie objawów z wieku dziecięcego. Wskaż kilka najbardziej odpowiednich strategii pasujących do objawów. Maksymalnie 5 strategii. Użyj języka profesjonalnego i odwołuj się do metodologii badawczych dotyczących ADHD. Każdy punkt analizy rozbuduj i powołaj się na wskazania diagnostyczne zgodne z dsm-5. jeżeli odpowiedzi sprawiają wrażenie losowych, wskaż to w podsumowaniu. Pytania i odpowiedzi dotyczą tej samej dorosłej osoby: ' + afterData.surveypartAdult + ' Pytania i odpowiedzi osoby badanej dotyczącej okresu dzieciństwa: ' + afterData.surveypartYoung;

      try {
        const completionAdult = await openai.chat.completions.create({
          model: "gpt-4o-mini-2024-07-18",
          messages: [{ role: "user", content: promptAdult }],
          temperature: 0.2,
        });
        contentPart1 = completionAdult.choices[0].message.content;
        console.log("part 1 done");
      } catch (error) {
        console.error("Błąd podczas komunikacji z OpenAI:", error);
      }

      try {
        const completionYoung = await openai.chat.completions.create({
          model: "gpt-4o-mini-2024-07-18",
          messages: [{ role: "user", content: promptYoung }],
          temperature: 0.2,
        });
        contentPart2 = completionYoung.choices[0].message.content;
        console.log("part 2 done");
      } catch (error) {
        console.error("Błąd podczas komunikacji z OpenAI:", error);
      }

      try {
        const completionFinal = await openai.chat.completions.create({
          model: "gpt-4o-mini-2024-07-18",
          messages: [{ role: "user", content: promptFinal }],
          temperature: 0.2,
        });
        contentPart3 = completionFinal.choices[0].message.content;
        console.log("part 3 done");
      } catch (error) {
        console.error("Błąd podczas komunikacji z OpenAI:", error);
      }
      const contentPart1BR = contentPart1.replace(/\n\n|<br\/><br\/>/g, "\n");
      const contentPart2BR = contentPart2.replace(/\n\n|<br\/><br\/>/g, "\n");
      const contentPart3BR = contentPart3.replace(/\n\n|<br\/><br\/>/g, "\n");

      await change.after.ref.update({ part1: contentPart1BR, part2: contentPart2BR, part3: contentPart3BR, email: email });
      sendDataToEndpoint('mariusz.duszczyk@exineo.pl', ' ', 'ADHDPremiumResult', contentPart1BR, contentPart2BR, contentPart3BR, 'Przegląd przed wysłaniem - Wynik analizy testu ADHD');
    }

    return null; // Zwróć null, aby zakończyć funkcję
  });

exports.testAdhdTestResutSend = functions.runWith({ timeoutSeconds: 540 }).database.ref('ADHDFull/{uidSaveId}').onUpdate(async (change, context) => {
    const beforeData = change.before.val(); // dane przed zmianą
    const afterData = change.after.val();  // dane po zmianie

    // Sprawdzamy, czy status został zmieniony z 0 na 1
    if (afterData.status === 2 && beforeData.status === 1) {
      console.log(`UID: ${context.params.uidSaveId}`);
      // Pobierz e-mail użytkownika z Firestore
      const doc = await admin.firestore().collection('customers').doc(context.params.uidSaveId).get();
      const email = doc.data().email;
      console.log(email);

      console.log(`Status: ${afterData.status}`);
      console.log('-------------------------');

      const promptAdult = afterData.part1;
      const promptYoung = afterData.part2;
      const promptFinal = afterData.part3;

      sendDataToEndpoint(email, ' ', 'ADHDPremiumResult', promptAdult, promptYoung, promptFinal, 'Wynik analizy testu ADHD');
    }

    return null; // Zwróć null, aby zakończyć funkcję
  });

exports.getWebinars = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  try {
    const res = await fetch('https://api.clickmeeting.com/v1/conferences/active', {
      headers: {
        'X-Api-Key': 'eu4461d452ad61b4a8c5680a507fc09f89358284d4'
      }
    });
    const jsonData = await res.json();
    const filteredData = jsonData.filter(item => item.type === 2 || item.type === 0);

    let htmlResponse = '';
    filteredData.forEach(item => {
      const startDate = new Date(item.starts_at.replace(/\+02:00$/, 'Z'));
      const endDate = new Date(item.ends_at.replace(/\+02:00$/, 'Z'));
      const duration = (endDate - startDate) / (1000 * 60); // duration in minutes

      const startDateLocal = startDate.toLocaleDateString();
      const startTimeLocal = startDate.toLocaleTimeString();


      htmlResponse += `
          
            <div class="webinar-name">${item.name}</div>
            <div class="webinar-item">
            <div class="webinar-date">Data:<br/>${startDateLocal}</div>
            <div class="webinar-date">Godzina:<br/>${startTimeLocal}</div>
            <div class="webinar-duration">Czas:<br/>${duration} minut</div>
            <a id="w-node-_280e91b2-bc61-aa44-d3a1-a39c18c0fd41-efff7928" href="${item.room_url}/register" target="_blank" class="rejestracjawebinar w-button">Sprawdź</a>
          </div>`;
    });








    return htmlResponse;
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'An error occurred while fetching webinars', error);
  }
});

exports.sendFeedback = functions.region('europe-central2').https.onCall((data, context) => {
  // Pobieranie danych z requestu
  const uidSave = data.uidSave;
  const type = data.type;
  const comment = data.comment;
  const category = data.cat;

  // Sprawdzenie czy użytkownik jest zalogowany
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Musisz być zalogowany, aby wykonać tę operację.');
  }

  // Zapisywanie danych w bazie Realtime Database
  return admin.database().ref('testfeedback/' + category).push({
    uidSave: uidSave,
    ocena: type,
    comment: comment,
    timestamp: admin.database.ServerValue.TIMESTAMP
  }).then(() => {
    return { success: true };
  }).catch(error => {
    throw new functions.https.HttpsError('internal', 'Wystąpił błąd podczas zapisywania danych: ' + error.message);
  });
});

//Funkcje administratorskie


exports.sumADHDScores = functions.region('europe-central2').pubsub.schedule('0 */12 * * *').onRun(async (context) => {
  //every 60 minutes
  //co 5 minut: */5 * * * *
  //co 12 godzin: 0 */12 * * *
  const db = admin.database();
  let totalADHDSum = 0;
  let totalTimeManagementSum = 0;
  let totalCvLimitSum = 0;
  let totalLmLimitSum = 0;
  let totalCreativitySum = 0;
  let totalSASelfCheckSum = 0;
  let totalTestStresSum = 0;
  let totalEmpatyTestSum = 0;
  let totalyouInWorkSum = 0;
  let totaladhdTestLimitSum = 0;

  try {
    const usersSnapshot = await db.ref('secdata').once('value');
    usersSnapshot.forEach(userSnapshot => {
      const uid = userSnapshot.key;

      const adhdTestLimitValue = userSnapshot.child('personal/adhdTestLimit').val();
      if (typeof adhdTestLimitValue === 'number') {
        totaladhdTestLimitSum += adhdTestLimitValue;
      }

      const youInWorkValue = userSnapshot.child('personal/youInWork').val();
      if (typeof youInWorkValue === 'number') {
        totalyouInWorkSum += youInWorkValue;
      }

      const EmpatyTestValue = userSnapshot.child('personal/EmpatyTest').val();
      if (typeof EmpatyTestValue === 'number') {
        totalEmpatyTestSum += EmpatyTestValue;
      }

      const TestStresValue = userSnapshot.child('personal/TestStres').val();
      if (typeof TestStresValue === 'number') {
        totalTestStresSum += TestStresValue;
      }

      const adhdValue = userSnapshot.child('personal/ADHDSelfCheck').val();
      if (typeof adhdValue === 'number') {
        totalADHDSum += adhdValue;
      }

      const SASelfCheckValue = userSnapshot.child('personal/SASelfCheck').val();
      if (typeof SASelfCheckValue === 'number') {
        totalSASelfCheckSum += SASelfCheckValue;
      }

      const timeManagementValue = userSnapshot.child('personal/TestTimeManagement').val();
      if (typeof timeManagementValue === 'number') {
        totalTimeManagementSum += timeManagementValue;
      }

      const cvLimitValue = userSnapshot.child('personal/checkCvLimit').val();
      if (typeof cvLimitValue === 'number') {
        totalCvLimitSum += cvLimitValue;
      }

      const lmLimitValue = userSnapshot.child('personal/checkLmLimit').val();
      if (typeof lmLimitValue === 'number') {
        totalLmLimitSum += lmLimitValue;
      }

      const creativityValue = userSnapshot.child('personal/testCreativity').val();
      if (typeof creativityValue === 'number') {
        totalCreativitySum += creativityValue;
      }
    });

    const timestamp = Date.now();
    await db.ref(`/admStat/${timestamp}`).set({
      totalADHDSum,
      totalTimeManagementSum,
      totalCvLimitSum,
      totalLmLimitSum,
      totalCreativitySum,
      totalSASelfCheckSum,
      totalTestStresSum,
      totalEmpatyTestSum,
      totalyouInWorkSum,
      totaladhdTestLimitSum,
      timestamp
    });

    console.log('Total sum of ADHD scores:', totalADHDSum);
    console.log('Total sum of Time Management scores:', totalTimeManagementSum);
    console.log('Total sum of CV Limit scores:', totalCvLimitSum);
    console.log('Total sum of LM Limit scores:', totalLmLimitSum);
    console.log('Total sum of Creativity scores:', totalCreativitySum);
  } catch (error) {
    console.error('Error reading data:', error);
  }

  return null;
});

exports.welbeingConf = functions.https.onCall(async (data, context) => {
  const { userId, morningCheck, eveningCheck, morningTime, eveningTime, emailCheck, smsCheck, whatsappCheck, phoneNumber } = data;

  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }
  // Pobierz e-mail użytkownika z Firestore
  const doc = await admin.firestore().collection('customers').doc(userId).get();
  const email = doc.data().email;
  const userRef = admin.database().ref(`/secdata/${userId}/personal/wellbeing/welbeingConf`);

  const userConfig = {
    morningCheck,
    eveningCheck,
    morningTime,
    eveningTime,
    emailCheck,
    smsCheck,
    whatsappCheck,
    phoneNumber,
    email
  };

  try {
    await userRef.set(userConfig);
    return { message: 'Ustawienia zostały zapisane.' };
  } catch (error) {
    console.error('Błąd podczas zapisywania ustawień:', error);
    throw new functions.https.HttpsError('unknown', 'Wystąpił błąd podczas zapisywania ustawień. Spróbuj ponownie.');
  }
});

exports.getWelbeingConf = functions.https.onCall(async (data, context) => {
  const { userId } = data;

  try {
    const snapshot = await admin.database().ref(`/secdata/${userId}/personal/wellbeing/welbeingConf`).once('value');
    const config = snapshot.val() || {
      morningCheck: false,
      eveningCheck: false,
      morningTime: '',
      eveningTime: '',
      emailCheck: true,
      smsCheck: false,
      whatsappCheck: false,
      phoneNumber: ''
    };

    return config;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw new functions.https.HttpsError('unknown', 'Failed to fetch settings');
  }
});

exports.surveyMorningTest = functions.region('europe-central2').runWith({ timeoutSeconds: 500 }).https.onCall(async (data, context) => {
  try {
    const text = data.data.map(obj => `Q: ${obj.Q}\nA: ${obj.A}`).join('\n\n');
    const uidSave = data.uidSave;
    const type = data.type;
    console.log("type: " + type);
    console.log('uidSave: ' + uidSave);
    let prompt;
    switch (type) {
      case "wellMorningTest":
        prompt = `Poniżej przedstawiono zestaw pytań i odpowiedzi z porannej ankiety dotyczącej samooceny. Twoim zadaniem jest przeanalizować odpowiedzi i określić następujące wskaźniki:
1. Ocena samopoczucia po przebudzeniu (skala 1-5, gdzie 5 oznacza "Bardzo dobrze", a 1 oznacza "Bardzo źle").
2. Ocena jakości snu (skala 1-5, gdzie 5 oznacza "Bardzo dobra", a 1 oznacza "Bardzo zła").
3. Czy osoba czuła się wypoczęta po przebudzeniu (1 - Tak, 0 - Nie).
4. Ocena poziomu energii na początku dnia (skala 1-5, gdzie 5 oznacza "Bardzo wysoki", a 1 oznacza "Bardzo niski").
5. Czy osoba miała zaplanowany czas na przerwy i relaks (1 - Tak, 0 - Nie).
6. Wskaźnik podsumowujący dobrostan osoby w momencie wypełniania testu (średnia z ocen samopoczucia, jakości snu, poziomu energii i zaplanowanych przerw).

Oto pytania i przykładowe odpowiedzi z ankiety:
1. Jak się czujesz po przebudzeniu? Odpowiedzi: ["Dobrze"]
2. Jak oceniłbyś/aś jakość swojego snu ostatniej nocy? Odpowiedzi: ["Dobra"]
3. Czy czułeś/aś się wypoczęty/a po przebudzeniu? Odpowiedzi: ["Tak"]
4. Jak oceniasz swój poziom energii na początku dnia? Odpowiedzi: ["Wysoki"]
5. Czy masz zaplanowany czas na przerwy i relaks? Odpowiedzi: ["Tak"]

Odpowiedź powinna być w formacie JSON:
{
    "morning_feeling": 4,
    "sleep_quality": 4,
    "well_rested": 1,
    "energy_level": 4,
    "planned_breaks": 1,
    "overall_wellbeing": 3.25,
    "summary": "Czułeś się dobrze po przebudzeniu, oceniłeś jakość swojego snu jako dobrą, czułeś się wypoczęty, miałeś wysoki poziom energii i zaplanowany czas na przerwy."
}

 Tutaj znajdują się odpowiedzi z testu: `;
        break;
      case "wellEveningTest":
        prompt = `Poniżej przedstawiono zestaw pytań i odpowiedzi z wieczornej ankiety dotyczącej samooceny. Twoim zadaniem jest przeanalizować odpowiedzi i określić następujące wskaźniki:
1. Ocena samopoczucia pod koniec dnia (skala 1-5, gdzie 5 oznacza "Bardzo dobrze", a 1 oznacza "Bardzo źle").
2. Ocena produktywności w ciągu dnia (skala 1-5, gdzie 5 oznacza "Bardzo wysoka", a 1 oznacza "Bardzo niska").
3. Czy osoba zrealizowała swoje główne zadanie na dziś (1 - Tak, 0 - Nie).
4. Czy osoba znalazła czas na relaks i odpoczynek (1 - Tak, 0 - Nie).
5. Ocena samopoczucia emocjonalnego w ciągu dnia (skala 1-5, gdzie 5 oznacza "Bardzo dobre", a 1 oznacza "Bardzo złe").
6. Wskaźnik podsumowujący dobrostan osoby w momencie wypełniania testu (średnia z ocen samopoczucia, produktywności, samopoczucia emocjonalnego i relaksu).

Oto pytania i przykładowe odpowiedzi z ankiety:
1. Jak się czujesz pod koniec dnia? Odpowiedzi: ["Dobrze"]
2. Jak oceniłbyś/aś swoją produktywność dzisiaj? Odpowiedzi: ["Wysoka"]
3. Czy udało Ci się zrealizować swoje główne zadanie na dziś? Odpowiedzi: ["Tak"]
4. Czy znalazłeś/aś czas na relaks i odpoczynek? Odpowiedzi: ["Tak"]
5. Jak oceniasz swoje samopoczucie emocjonalne dzisiaj? Odpowiedzi: ["Dobre"]

Odpowiedź powinna być w formacie JSON:
{
    "evening_feeling": 4,
    "productivity": 4,
    "task_completed": 1,
    "found_relax_time": 1,
    "emotional_feeling": 4,
    "overall_wellbeing": 3.75,
    "summary": "Czułeś się dobrze pod koniec dnia, oceniłeś swoją produktywność jako wysoką, udało Ci się zrealizować główne zadanie, znalazłeś czas na relaks i miałeś dobre samopoczucie emocjonalne."
}
    Tutaj znajdują się odpowiedzi z testu: 
`;
        break;
        prompt = 'Poniżej przedstawiono zestaw pytań i odpowiedzi z Testu Kreatywności. Symbol "Q:" oznacza pytanie, a "A:" oznacza odpowiedź. Twoim zadaniem jest przeanalizować przedstawione odpowiedzi, aby ocenić umiejętności twórczego myślenia i rozwiązywania problemów osoby badanej. Oceń również, jak poziom kreatywności może wpływać pozytywnie i negatywnie na jej działania zawodowe i osobiste. Jeśli zauważysz, że którakolwiek z odpowiedzi wygląda na losowo wprowadzoną treść (np. przypadkowe uderzenia w klawisze), prosimy o uwzględnienie tej informacji w swojej analizie.  W odpowiedzi nie używaj znaków **, zamiast tego odpowiednie fragmenty umieść w znacznikach <b>. Oto pytania i odpowiedzi osoby badanej: ';
        break;

      default:
        // Kod do wykonania, gdy żaden z powyższych przypadków nie jest spełniony
        break;
    };

    console.log("pełny prompt: " + prompt + text);
    const completion = await openai.chat.completions.create({
      response_format: { "type": "json_object" },
      model: "gpt-4o-mini-2024-07-18",
      messages: [{ role: "user", content: prompt + text }],
      temperature: 0.5,
    });
    //console.log("przed parsowaniu: " + completion.choices[0].message.content);

    const contentFull = completion.choices[0].message.content;
    const ContentShortMail = contentFull.length > 100 ? contentFull.substring(0, 100) + '...' : contentFull;

    console.log("po parsowaniu: " + contentFull);
    const rusultWithBr = contentFull.replace(/\n/g, "<br/>");
    //const email = "mariusz.duszczyk@exineo.pl";
    //const mailFinal = `Użytkownik wypełnił test wieku dziecięcego <br/>` + rusultWithBr + `<br/>`;

    //sendDataToEndpoint(email, mailFinal, 'standard');
    //const result = {
    //  comment:contentFull,
    //  surveypartYoung: text,
    //  surveypartAdult: baseResultADHD,
    //  date: admin.database.ServerValue.TIMESTAMP,
    //  status: 0,
    //};

    if (uidSave !== "unlogged") {
      const result = {
        comment: rusultWithBr,
        result: JSON.parse(contentFull),
        survey: text,
        date: admin.database.ServerValue.TIMESTAMP,
        status: 0,
      };
      //await db.ref('secdata/' + uidSave + '/personal').update(result);
      const checkLimitRefTypeTest = admin.database().ref(`secdata/${uidSave}/personal/${type}`);
      const checkLimitRef = admin.database().ref(`secdata/${uidSave}/personal/limitTests`);
      try {
        await checkLimitRef.transaction(currentValue => {
          return (currentValue || 0) + 1;
        });
        await checkLimitRefTypeTest.transaction(currentValue => {
          return (currentValue || 0) + 1;
        });
      } catch (error) {
        console.error('Error incrementing check limit:', error);
      }




      await db.ref('wellBeingInsight/' + uidSave + '/' + type).push({
        timestamp: admin.database.ServerValue.TIMESTAMP,
        ...result
      });
      await db.ref('wellBeingInsight/' + uidSave + '/' + type + '/last').set({
        timestamp: admin.database.ServerValue.TIMESTAMP,
        ...result
      });
      console.log("podsumowanie ankiety: " + JSON.parse(contentFull).summary)
      // Pobierz e-mail użytkownika z Firestore
      //          const doc = await admin.firestore().collection('customers').doc(uidSave).get();
      //        const email = doc.data().email;
      //         await admin.firestore().collection("mail").add({
      //            to: email,
      //            template: {/
      //              name: "insightsmail",
      //              data: {
      //                comment: ContentShortMail,
      //              },
      //            },
      //          });

    } else {
      const result = {
        comment: rusultWithBr,
        survey: text,
        date: admin.database.ServerValue.TIMESTAMP,
        status: 0,
      };
      //await db.ref('secdata/' + uidSave + '/personal').update(result);
      //await db.ref('Neuroinsights/unlogged/' + type + '/' + admin.database.ServerValue.TIMESTAMP).update(result);
      await db.ref('Neuroinsights/unlogged/' + type).push({
        timestamp: admin.database.ServerValue.TIMESTAMP,
        ...result
      });
    }

    //console.log(result);
    //await db.ref('secdata/' + uidSave + '/personal').update(result);
    //await db.ref('ADHDFull/' + uidSave).update(result);

    return "<p>Dziękujemy. Poniżej krótkie podsumowanie Twojego testu</p> <br/>" + rusultWithBr;
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }
});

exports.getLastEveningTest = functions.https.onCall(async (data, context) => {
  const userId = data.userId;

  if (!userId) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID is required.');
  }

  try {
    const userRef = admin.database().ref(`/wellBeingInsight/${userId}/wellEveningTest`).orderByKey().limitToLast(1);
    const snapshot = await userRef.once('value');

    if (!snapshot.exists()) {
      return {
        wellbeing: {
          mood: 0,
          productivity: 0,
          task_completion: 0,
          relaxation: 0,
          emotional_state: 0
        },
        datatest: 3601
      };
    }

    const lastTest = snapshot.val();
    const testKey = Object.keys(lastTest)[0];
    const testData = lastTest[testKey];

    return {
      wellbeing: testData.result,
      datatest: testData.timestamp
    };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', 'Błąd podczas pobierania wyników testu:', error.message);
  }
});

exports.getLastMorningTest = functions.https.onCall(async (data, context) => {
  const userId = data.userId;

  if (!userId) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID is required.');
  }

  try {
    const userRef = admin.database().ref(`/wellBeingInsight/${userId}/wellMorningTest`).orderByKey().limitToLast(1);
    const snapshot = await userRef.once('value');

    if (!snapshot.exists()) {
      return {
        wellbeing: {
          mood: 0,
          productivity: 0,
          task_completion: 0,
          relaxation: 0,
          emotional_state: 0
        },
        datatest: 3601
      };
    }

    const lastTest = snapshot.val();
    const testKey = Object.keys(lastTest)[0];
    const testData = lastTest[testKey];

    return {
      wellbeing: testData.result,
      datatest: testData.timestamp
    };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', 'Błąd podczas pobierania wyników testu:', error.message);
  }
});

exports.scheduleEmailCheck = functions.region('europe-central2').pubsub.schedule('every 30 minutes').onRun(async (context) => {
  try {
    const secdataRef = admin.database().ref('/secdata');
    const secdataSnapshot = await secdataRef.once('value');

    const updates = {};

    secdataSnapshot.forEach(childSnapshot => {
      const userId = childSnapshot.key;
      const userConfig = childSnapshot.child('personal/wellbeing/welbeingConf');

      const morningCheck = userConfig.child('morningCheck').val();
      const eveningCheck = userConfig.child('eveningCheck').val();
      const emailCheck = userConfig.child('emailCheck').val();
      const email = userConfig.child('email').val();

      if (emailCheck === true) {
        const userUpdates = {};

        if (morningCheck === true) {
          const morningTime = userConfig.child('morningTime').val();
          if (morningTime) {
            userUpdates.morningTime = morningTime;
          }
        }

        if (eveningCheck === true) {
          const eveningTime = userConfig.child('eveningTime').val();
          if (eveningTime) {
            userUpdates.eveningTime = eveningTime;
          }
        }

        if (email) {
          userUpdates.email = email;
        }

        if (Object.keys(userUpdates).length > 0) {
          updates[userId] = userUpdates;
        }
      }
    });

    await admin.database().ref('/wellBeingInsight/mails').set(updates);

    console.log('Email schedule check completed successfully.');
  } catch (error) {
    console.error('Error during email schedule check:', error);
  }
});

exports.scheduleSmsCheck = functions.region('europe-central2').pubsub.schedule('every 30 minutes').onRun(async (context) => {
  try {
    const secdataRef = admin.database().ref('/secdata');
    const secdataSnapshot = await secdataRef.once('value');

    const updates = {};

    secdataSnapshot.forEach(childSnapshot => {
      const userId = childSnapshot.key;
      const userConfig = childSnapshot.child('personal/wellbeing/welbeingConf');

      const morningCheck = userConfig.child('morningCheck').val();
      const eveningCheck = userConfig.child('eveningCheck').val();
      const smsCheck = userConfig.child('smsCheck').val();
      const phoneNumber = userConfig.child('phoneNumber').val();

      if (smsCheck === true && phoneNumber) {
        const userUpdates = {};

        if (morningCheck === true) {
          const morningTime = userConfig.child('morningTime').val();
          if (morningTime) {
            userUpdates.morningTime = morningTime;
          }
        }

        if (eveningCheck === true) {
          const eveningTime = userConfig.child('eveningTime').val();
          if (eveningTime) {
            userUpdates.eveningTime = eveningTime;
          }
        }

        if (phoneNumber) {
          userUpdates.phoneNumber = phoneNumber;
        }

        if (Object.keys(userUpdates).length > 0) {
          updates[userId] = userUpdates;
        }
      }
    });

    await admin.database().ref('/wellBeingInsight/sms').set(updates);

    console.log('SMS schedule check completed successfully.');
  } catch (error) {
    console.error('Error during SMS schedule check:', error);
  }
});

exports.checkAndScheduleEmails = functions.region('europe-central2').pubsub.schedule('0 * * * *').onRun(async (context) => {
  const currentTime = new Date();
  console.log(`Current server time: ${currentTime.toISOString()}`);
  currentTime.setHours(currentTime.getHours() + 2); // Dopasowanie do strefy GMT+2
  const currentHour = ("0" + currentTime.getHours()).slice(-2) + ":00";
  console.log(`Current hour for comparison: ${currentHour}`);

  try {
    const mailRef = admin.database().ref('/wellBeingInsight/mails');
    const mailSnapshot = await mailRef.once('value');

    const mailsToSend = [];

    mailSnapshot.forEach(childSnapshot => {
      const mailData = childSnapshot.val();
      const uid = childSnapshot.key; // Pobierz UID użytkownika
      if (mailData.morningTime === currentHour) {
        mailsToSend.push({
          email: mailData.email,
          subject: "Poranna ankieta",
          body: `Kliknij i wypełnij poranną ankietę: https://app.adhdbuddy.me/morning---mobile-neuroinsights.html?id=${uid}`
        });
      }
      if (mailData.eveningTime === currentHour) {
        mailsToSend.push({
          email: mailData.email,
          subject: "Wieczorna ankieta",
          body: `Kliknij i wypełnij wieczorną ankietę: https://app.adhdbuddy.me/evening---mobile-neuroinsights.html?id=${uid}`
        });
      }
    });

    const firestoreBatch = admin.firestore().batch();
    mailsToSend.forEach(mail => {
      const mailDocRef = admin.firestore().collection('mail').doc();
      firestoreBatch.set(mailDocRef, {
        to: mail.email,
        message: {
          subject: mail.subject,
          text: mail.body
        }
      });
    });

    await firestoreBatch.commit();

    console.log('Maile zostały pomyślnie zaplanowane.');
  } catch (error) {
    console.error('Błąd podczas sprawdzania i planowania maili:', error);
  }
});

exports.checkAndScheduleSms = functions.region('europe-central2').pubsub.schedule('0 * * * *').onRun(async (context) => {
  const currentTime = new Date();
  console.log(`Current server time: ${currentTime.toISOString()}`);
  currentTime.setHours(currentTime.getHours() + 2); // Dopasowanie do strefy GMT+2
  const currentHour = ("0" + currentTime.getHours()).slice(-2) + ":00";
  console.log(`Current hour for comparison: ${currentHour}`);

  try {
    const smsRef = admin.database().ref('/wellBeingInsight/sms');
    const smsSnapshot = await smsRef.once('value');

    const smsToSend = [];

    smsSnapshot.forEach(childSnapshot => {
      const smsData = childSnapshot.val();
      const uid = childSnapshot.key; // Pobierz UID użytkownika
      if (smsData.morningTime === currentHour) {
        smsToSend.push({
          to: smsData.phoneNumber,
          body: `Kliknij i wypełnij poranną ankietę: https://app.adhdbuddy.me/morning---mobile-neuroinsights.html?id=${uid}`
        });
      }
      if (smsData.eveningTime === currentHour) {
        smsToSend.push({
          to: smsData.phoneNumber,
          body: `Kliknij i wypełnij wieczorną ankietę: https://app.adhdbuddy.me/evening---mobile-neuroinsights.html?id=${uid}`
        });
      }
    });

    const firestoreBatch = admin.firestore().batch();
    smsToSend.forEach(sms => {
      const smsDocRef = admin.firestore().collection('messages').doc();
      firestoreBatch.set(smsDocRef, {
        to: sms.to,
        body: sms.body
      });
    });

    await firestoreBatch.commit();

    console.log('SMSy zostały pomyślnie zaplanowane.');
  } catch (error) {
    console.error('Błąd podczas sprawdzania i planowania SMSów:', error);
  }
});


exports.collectLatestTestComments = functions.region('europe-central2').runWith({ memory: '512MB', timeoutSeconds: 540 }).https.onCall(async (data, context) => {
    try {
      const db = admin.database();
      const neuroinsightsRef = db.ref('/Neuroinsights');
      const surveysRef = db.ref('/surveys');
      const cvBuddyRef = db.ref('/cvBuddy');
      const auth = admin.auth();

      const snapshot = await neuroinsightsRef.once('value');
      const updates = {};

      snapshot.forEach(userSnapshot => {
        const userId = userSnapshot.key;
        updates[userId] = { tests: {} };

        userSnapshot.forEach(categorySnapshot => {
          const category = categorySnapshot.key;
          const latestTestKey = Object.keys(categorySnapshot.val()).pop();
          const latestTest = categorySnapshot.child(latestTestKey).val();
          if (latestTest && latestTest.comment !== undefined) {
            updates[userId].tests[category] = latestTest.comment;
          }
        });
      });

      const surveysSnapshot = await surveysRef.once('value');
      surveysSnapshot.forEach(userSnapshot => {
        const userId = userSnapshot.key;
        if (!updates[userId]) {
          updates[userId] = { tests: {} };
        }
        const surveyComment = userSnapshot.val().comment;
        if (surveyComment !== undefined) {
          updates[userId].tests['ADHD Test Impulsywność'] = surveyComment;
        }
      });

      const cvBuddySnapshot = await cvBuddyRef.once('value');
      cvBuddySnapshot.forEach(userSnapshot => {
        const userId = userSnapshot.key;
        if (!updates[userId]) {
          updates[userId] = { tests: {} };
        }
        const cvSummary = userSnapshot.child('cv/testJSON/Podsumowanie').val();
        if (cvSummary !== undefined) {
          updates[userId].tests['cvBuddy'] = cvSummary;
        }
      });

      for (const userId in updates) {
        try {
          const userRecord = await auth.getUser(userId);
          updates[userId]['email'] = userRecord.email;
          updates[userId]['lastLogin'] = userRecord.metadata.lastSignInTime || null;
        } catch (error) {
          if (error.code === 'auth/user-not-found') {
            const newUserId = `unreg-${userId}`;
            updates[newUserId] = updates[userId];
            delete updates[userId];
          } else {
            console.error(`Error fetching user data for ${userId}:`, error);
          }
        }
      }

      const finalUpdates = {};

      for (const userId in updates) {
        finalUpdates[`/testresults/${userId}/tests`] = updates[userId].tests;
        if (updates[userId].email !== undefined) {
          finalUpdates[`/testresults/${userId}/email`] = updates[userId].email;
        }
        if (updates[userId].lastLogin !== undefined) {
          finalUpdates[`/testresults/${userId}/lastLogin`] = updates[userId].lastLogin;
        }

        // Concatenate comments with test names to create the prompt
        const prompt = Object.entries(updates[userId].tests)
          .map(([testName, comment]) => `${testName}: ${comment}`)
          .join(' ');
        finalUpdates[`/testresults/${userId}/prompt`] = prompt;
      }

      await db.ref().update(finalUpdates);

      return { success: true };
    } catch (error) {
      console.error('Błąd podczas pobierania wyników testów:', error);
      throw new functions.https.HttpsError('unknown', 'Błąd podczas pobierania wyników testów:', error.message);
    }
  });

//New OpenAI functions



exports.getWellBeingInsight = functions.region('europe-central2').runWith({ timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  // Verify that the request is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const uid = context.auth.uid;
  const dbPath = `/wellBeingInsight/${uid}`;

  try {
    // Fetch the content from the Realtime Database
    const snapshot = await admin.database().ref(dbPath).once('value');
    const wellBeingData = snapshot.val();
    const wellBeingDataVal = JSON.stringify(wellBeingData);

    if (!wellBeingData) {
      throw new functions.https.HttpsError('not-found', 'Nie wykonałeś żadnych testów.');
    }

    // Prepare the prompt for OpenAI
    const prompt = `Podsumuj i przeanalizuj wyniki codziennych porannych i wieczornych testów samopoczucia użytkownika. Podaj średnie wartości wskaźników porannych i wieczornych w formacie JSON. Reszta analizy powinna być przedstawiona jako sformatowany tekst w znacznikach <b>, <p> oraz <h5>. Opisowa analiza musi być szczegółowa i zawierać rekomendacje dla użytkownika. Odnieś się również do ilości przeanalizowanych testów i jezeli ich jest mniej niż 15, odnieś się do tego. Przedstawiane w opisowej analizie wskazniki wyników nazwij w sposób zrozumiały. Cała opisowa analiza Powinna być zawarta w pojedynczym kluczu JSON o nazwie 'comment'. Odpowiedz podaj tylko w JSON nie dodając żadnych dodatwowych znaków.  w formacie zgodnym z:
    {
    "comment":"Twoja odpowiedz tutaj"
    }
    Codzienne wyniki poranne i wieczorne testów samopoczucia: ${wellBeingDataVal}`;

    // Make the request to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });
    const responseWell = completion.choices[0].message.content;
    //console.log(`responseWell: "${JSON.stringify(responseWell)}"`);
    const updates = {
      report: responseWell,
      timestamp: admin.database.ServerValue.TIMESTAMP
    };
    await admin.database().ref(`/wellBeingInsight/${uid}/reports`).push(updates);

    // Return the full response from OpenAI to the client
    return {
      success: true,
      openAiResponse: completion.choices[0].message.content
    };
    
  } catch (error) {
    console.error('Error fetching well-being insight:', error);
    throw new functions.https.HttpsError('unknown', 'Nie wykonałeś żadnych testów.', error.message);
  }
});

exports.getTestsUnpaid = functions.region('europe-central2').https.onCall(async (data, context) => {
  const db = admin.database();
  const auth = admin.auth();
  const testsUnpaidRef = db.ref('/testsUnpaid');
  const results = [];

  try {
    const snapshot = await testsUnpaidRef.once('value');

    const promises = [];

    snapshot.forEach(userSnapshot => {
      const uid = userSnapshot.key;

      // Pobierz adres e-mail użytkownika z Firebase Authentication
      const promise = auth.getUser(uid).then(userRecord => {
        const email = userRecord.email;

        userSnapshot.forEach(testSnapshot => {
          const testType = testSnapshot.key;
          testSnapshot.forEach(recordSnapshot => {
            const recordKey = recordSnapshot.key;
            results.push({
              uid,
              email,
              testType,
              recordKey
            });
          });
        });
      }).catch(error => {
        console.error(`Error fetching user data for ${uid}:`, error);
      });

      promises.push(promise);
    });

    await Promise.all(promises);

    return { success: true, data: results };
  } catch (error) {
    console.error('Error getting tests unpaid:', error);
    throw new functions.https.HttpsError('unknown', 'Error getting tests unpaid', error.message);
  }
});

exports.markTestsPaid = functions.region('europe-central2').https.onCall(async (data, context) => {
  const db = admin.database();
  const firestore = admin.firestore();
  const uids = data.uids;

  try {
    for (const item of uids) {
      const { uid, testType, recordKey } = item;

      const sourceRef = db.ref(`/testsUnpaid/${uid}/${testType}/${recordKey}`);
      const destinationRef = db.ref(`/Neuroinsights/${uid}/${testType}/${recordKey}`);

      const snapshot = await sourceRef.once('value');
      const recordData = snapshot.val();

      if (recordData) {
        await destinationRef.set(recordData);
        await sourceRef.remove();

        try {
          // Pobierz e-mail użytkownika z Firestore
          const doc = await firestore.collection('customers').doc(uid).get();
          if (!doc.exists) {
            console.error(`No customer document found for UID: ${uid}`);
            continue;
          }

          const email = doc.data().email;
          if (email) {
            await firestore.collection("mail").add({
              to: email,
              template: {
                name: "paidtests",
                data: {
                  comment: "Płatność wykonana",
                },
              },
            });
          } else {
            console.error(`No email found for UID: ${uid}`);
          }
        } catch (error) {
          console.error(`Error fetching email for UID: ${uid}:`, error);
        }
      }
    }

    return { success: true, message: 'Tests marked as paid and moved successfully.' };
  } catch (error) {
    console.error('Error marking tests as paid:', error);
    throw new functions.https.HttpsError('unknown', 'Error marking tests as paid', error.message);
  }
});

exports.getTestDetails = functions.region('europe-central2').https.onCall(async (data, context) => {
  const { id, testname, subkey } = data;

  if (!id || !testname || !subkey) {
      throw new functions.https.HttpsError('invalid-argument', 'The function must be called with three arguments: id, testname, and subkey.');
  }

  try {
      const dbRef = admin.database().ref(`Neuroinsights/${id}/${testname}/${subkey}`);
      const descriptionRef = admin.database().ref(`Neuroinsights/InsightsDescriptions/${testname}`);
      
      // Pobranie danych testu
      const snapshot = await dbRef.once('value');
      if (!snapshot.exists()) {
          throw new functions.https.HttpsError('not-found', `Data not found for id: ${id}, testname: ${testname}, subkey: ${subkey}`);
      }
      const testData = snapshot.val();
      
      // Pobranie opisu testu
      const descriptionSnapshot = await descriptionRef.once('value');
      const descriptionData = descriptionSnapshot.val();
      const name = descriptionData ? descriptionData.name : null;
      const description = descriptionData ? descriptionData.description : null;
      
      return { 
          success: true, 
          data: {
              ...testData,
              name,
              description
          }
      };
  } catch (error) {
      console.error('Error fetching data:', error);
      throw new functions.https.HttpsError('unknown', 'Error fetching data', error.message);
  }
});

exports.getTestDetailsNew = functions.region('europe-central2').https.onCall(async (data, context) => {
  const { id, testname, subkey } = data;

  if (!id || !testname || !subkey) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with three arguments: id, testname, and subkey.');
  }

  try {
    const dbRef = admin.database().ref(`Neuroinsights/${id}/${testname}/${subkey}`);
    const descriptionRef = admin.database().ref(`Neuroinsights/InsightsDescriptions/${testname}`);
    const activeCvRef = admin.database().ref(`secdata/${id}/personal/activeCv`);

    // Pobranie wartości activeCv
    const activeCvSnapshot = await activeCvRef.once('value');
    const activeCv = activeCvSnapshot.val();

    // Pobranie danych testu
    const snapshot = await dbRef.once('value');
    if (!snapshot.exists()) {
      throw new functions.https.HttpsError('not-found', `Data not found for id: ${id}, testname: ${testname}, subkey: ${subkey}`);
    }
    const testData = snapshot.val();

    // Pobranie opisu testu
    const descriptionSnapshot = await descriptionRef.once('value');
    const descriptionData = descriptionSnapshot.val();
    const name = descriptionData ? descriptionData.name : null;
    const type = descriptionData ? descriptionData.type : null;
    const description = descriptionData ? descriptionData.description : null;

    // Jeśli activeCv nie równa się 1, wyczyść wskaźniki i wyjaśnienia, oraz skróć komentarz

    if (type === "free") {

    if (activeCv === 2) { //czasowo odblokowane wyniki testów
      if (testData.survey) {
        testData.survey = testData.survey.substring(0, 250) + "...";
      }
      if (testData.comment) {
        testData.comment = testData.comment.substring(0, 250) + "...";
      }
    }
  }

    return {
      success: true,
      data: {
        ...testData,
        name,
        description,
        type,
        activeCv
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new functions.https.HttpsError('unknown', 'Error fetching data', error.message);
  }
});


exports.generateWeeklyReport = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '2GB' }).https.onCall(async (data, context) => {
    const db = admin.database();
    const firestore = admin.firestore();
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    let processed = 0;

    try {
      // Pobieranie użytkowników z Firestore z kolekcji customers
      const customersSnapshot = await firestore.collection('contacts').get();
      const users = customersSnapshot.docs.map(doc => ({ uid: doc.id, email: doc.data().email }));

      // Przetwarzanie każdego użytkownika
      for (const user of users) {
        await processUser(user, db, firestore, oneWeekAgo);
        processed++;
      }

      return { success: true, message: 'Processed ' + processed + ' users.' };
    } catch (error) {
      console.error('Error fetching users from Firestore:', error);
      throw new functions.https.HttpsError('internal', 'An error occurred during the user processing.');
    }
  });


  exports.updateStartLevels = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '2GB' }).https.onCall(async (data, context) => {
    const db = admin.database();
    const firestore = admin.firestore();
    let processed = 0;

    try {
      // Pobieranie użytkowników z Firestore z kolekcji customers
      const customersSnapshot = await firestore.collection('contacts').get();
      const users = customersSnapshot.docs.map(doc => ({ uid: doc.id }));

      // Przetwarzanie każdego użytkownika
      for (const user of users) {
        const uid = user.uid;
        console.log("uid: :" + uid);
        await checkUserActivityLevel(uid);
        processed++;
      }

      return { success: true, message: 'Processed ' + processed + ' users.' };
    } catch (error) {
      console.error('Error fetching users from Firestore:', error);
      throw new functions.https.HttpsError('internal', 'An error occurred during the user processing.');
    }
  });

// Firebase Function `onCall` - obsługuje zamianę tekstu na mowę
exports.convertTextToSpeech = functions.https.onCall(async (data, context) => {
  try {
    // Pobieramy tekst z Realtime Database
    const userId = data.uidSave;
    const keyId = data.positionid;
    const snapshot = await admin.database().ref(`/transcriptions/${userId}/${keyId}/sumFull`).once('value');
    const text = snapshot.val();
    console.log(text);

    if (!text) {
      throw new functions.https.HttpsError('not-found', 'Brak tekstu w bazie danych.');
    }

    // Zamiana tekstu na mowę za pomocą OpenAI API
    const audioBase64 = await textToSpeech(text);

    // Zwracamy dźwięk zakodowany w base64
    return { audioContent: audioBase64 };
  } catch (error) {
    console.error("Error during text to speech:", error);
    throw new functions.https.HttpsError('internal', 'Błąd podczas przetwarzania tekstu na mowę.');
  }
});


//funkcje ogólne usera

exports.getUserActiveLevel = functions.region('europe-central2').https.onCall(async (data, context) => {
  // Sprawdzenie, czy użytkownik jest zalogowany
  if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Musisz być zalogowany, aby wykonać tę operację.');
  }

  const uid = context.auth.uid; // Pobranie uid użytkownika
  const dbRef = admin.database().ref();
  //checkAndCreateAssistant(uid);

  try {
      // Odczytanie activeLevel z bazy danych

      const subscriptionSnapshot = await dbRef.child(`secdata/${uid}/personal/activeCv`).once('value');
      const activeLevelSnapshot = await dbRef.child(`secdata/${uid}/personal/activeLevel`).once('value');
      const totalCountSnapshot = await dbRef.child(`secdata/${uid}/personal/totalCount`).once('value');
      const jobAdCountSnapshot = await dbRef.child(`secdata/${uid}/personal/jobAdCount`).once('value');
      const transcriptionCountSnapshot = await dbRef.child(`secdata/${uid}/personal/transcriptionCount`).once('value');
      const testCountSnapshot = await dbRef.child(`secdata/${uid}/personal/testCount`).once('value');
      const parametersActive = await dbRef.child(`secdata/${uid}/personal/parametersActiveVal`).once('value');
      const parametersActiveVal = parametersActive.val() || 0;

      if (subscriptionSnapshot.exists() && subscriptionSnapshot.val() === 1 && activeLevelSnapshot.val() < 5) {

        const activeLevel = 4;
        const totalCount = totalCountSnapshot.val() || 0;
        const jobAdCount = jobAdCountSnapshot.val() || 0;
        const transcriptionCount = transcriptionCountSnapshot.val() || 0;
        const testCount = testCountSnapshot.val() || 0;
        console.log(`Poziom aktywności dla użytkownika ${uid}: ${activeLevel}`);
        return { activeLevel, totalCount, jobAdCount, transcriptionCount, testCount, parametersActiveVal }; // Zwrócenie wartości activeLevel


      } else {

      if (activeLevelSnapshot.exists()) {
          const activeLevel = activeLevelSnapshot.val() || 0;
          const totalCount = totalCountSnapshot.val() || 0;
          const jobAdCount = jobAdCountSnapshot.val() || 0;
          const transcriptionCount = transcriptionCountSnapshot.val() || 0;
          const testCount = testCountSnapshot.val() || 0;
          console.log(`Poziom aktywności dla użytkownika ${uid}: ${activeLevel}`);
          return { activeLevel, totalCount, jobAdCount, transcriptionCount, testCount, parametersActiveVal }; // Zwrócenie wartości activeLevel
      } else {
          console.log(`Brak aktywnego poziomu dla użytkownika ${uid}`);
          const activeLevel = 0;
          const totalCount = 0;
          const jobAdCount = 0;
          const transcriptionCount = 0;
          const testCount = 0;
          //console.log(`Poziom aktywności dla użytkownika ${uid}: ${activeLevel}`);
          return { activeLevel, totalCount, jobAdCount, transcriptionCount, testCount, parametersActiveVal }; // Zwrócenie wartości activeLevel
          //throw new functions.https.HttpsError('not-found', 'Brak poziomu aktywności dla użytkownika.');
      }
    }
  } catch (error) {
      console.error('Błąd podczas odczytywania poziomu aktywności:', error);
      console.log(`Brak aktywnego poziomu dla użytkownika ${uid}`);
      const activeLevel = 0;
      const totalCount = 0;
      const jobAdCount = 0;
      const transcriptionCount = 0;
      const testCount = 0;
      //console.log(`Poziom aktywności dla użytkownika ${uid}: ${activeLevel}`);
      return { activeLevel, totalCount, jobAdCount, transcriptionCount, testCount, parametersActiveVal }; // Zwrócenie wartości activeLevel
      //throw new functions.https.HttpsError('internal', 'Nie udało się pobrać poziomu aktywności.');
  }
});

exports.syncUserDataToFirestore = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '2GB' }).https.onCall(async (data, context) => {
  const dbRef = admin.database().ref();
  const firestore = admin.firestore();
  let processed = 0;

  try {
    // Pobranie wszystkich użytkowników z Realtime Database
    const usersSnapshot = await dbRef.child('secdata').once('value');
    if (!usersSnapshot.exists()) {
      return { success: false, message: 'No users found in Realtime Database.' };
    }

    const users = usersSnapshot.val();

    // Przetwarzanie każdego użytkownika
    for (const uid in users) {
      if (users.hasOwnProperty(uid)) {
        const userData = users[uid];
        const totalCount = userData.personal?.totalCount || 0;

        // Sprawdź, czy totalCount jest większy niż 0
        if (totalCount > 0) {
          const activeLevel = userData.personal?.activeLevel || 0;
          const jobAdCount = userData.personal?.jobAdCount || 0;
          const transcriptionCount = userData.personal?.transcriptionCount || 0;
          const testCount = userData.personal?.testCount || 0;

          // Zapisanie danych w Firestore
          await firestore.collection('admin').doc('users').collection(uid).doc('data').set({
            activeLevel,
            totalCount,
            jobAdCount,
            transcriptionCount,
            testCount,
          });

          processed++;
        }
      }
    }

    return { success: true, message: 'Processed ' + processed + ' users.' };
  } catch (error) {
    console.error('Error processing users:', error);
    throw new functions.https.HttpsError('internal', 'An error occurred while processing users.');
  }
});

exports.fetchSortedUserData = functions.region('europe-central2').https.onCall(async (data, context) => {
  try {
    // Sprawdzenie, czy użytkownik jest autoryzowany
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Musisz być zalogowany, aby wykonać tę operację.');
    }

    // Pobierz kolekcję 'users' w 'admin'
    const usersCollectionRef = admin.firestore().collection('admin').doc('users');

    const snapshot = await usersCollectionRef.listCollections(); // Pobieramy wszystkie podkolekcje (UID użytkowników)
    
    if (snapshot.length === 0) {
      return { users: [] }; // Jeśli kolekcja jest pusta
    }

    const users = [];
    for (const userCollection of snapshot) {
      const dataDoc = await userCollection.doc('data').get(); // Pobierz dokument 'data' w każdym UID
      if (dataDoc.exists) {
        const userData = dataDoc.data();

        // Filtracja użytkowników z totalCount > 2
        if (userData.totalCount > 2) {
          let email = '';
          let name = 'nie istnieje';

          try {
            const userRecord = await admin.auth().getUser(userCollection.id);
            email = userRecord.email || '';
            name = userRecord.displayName || 'nie istnieje';
          } catch (authError) {
            // Użytkownik nie istnieje w Firebase Authentication
            console.warn(`Użytkownik o UID ${userCollection.id} nie istnieje w Firebase Authentication.`);
          }

          users.push({
            uid: userCollection.id,
            email: email,
            name: name,
            activeLevel: userData.activeLevel,
            totalCount: userData.totalCount,
            jobAdCount: userData.jobAdCount,
            transcriptionCount: userData.transcriptionCount,
            testCount: userData.testCount,
          });
        }
      }
    }

    // Sortowanie użytkowników według totalCount malejąco
    users.sort((a, b) => b.totalCount - a.totalCount);

    return { users };
  } catch (error) {
    console.error('Błąd podczas pobierania danych użytkowników:', error);
    throw new functions.https.HttpsError('internal', 'Wystąpił błąd podczas pobierania danych użytkowników.');
  }
});


//Promocje

exports.checkPromo = functions.region('europe-central2').https.onCall(async (data, context) => {
  // Sprawdzenie, czy użytkownik jest uwierzytelniony
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Użytkownik nie jest uwierzytelniony.'
    );
  }

  const uid = context.auth.uid;
  const code = data.code;

  // Sprawdzenie, czy kod promocyjny jest poprawny
  if (code !== '1002') {
    return { message: 'Niepoprawny kod promocyjny.' };
  }

  const db = admin.database();
  const promoRef = db.ref(`/secdata/${uid}/personal/promo/promo1/activated`);

  try {
    const snapshot = await promoRef.once('value');
    const activatedValue = snapshot.val();

    if (activatedValue === 1) {
      // Użytkownik ma już aktywną promocję
      return { message: 'Masz już aktywną promocję.' };
    } else if (activatedValue === 0) {
      // Użytkownik korzystał już z tej promocji w przeszłości
      return { message: 'Korzystałeś już w przeszłości z tej promocji.' };
    } else {
      // Promocja nie była wcześniej aktywowana, kontynuujemy
      const currentTime = Date.now();
      const activatedFrom = currentTime;
      const activatedTo = currentTime + 30 * 24 * 60 * 60 * 1000; // Dodajemy 30 dni w milisekundach

      // Aktualizacja wartości w Realtime Database
      await promoRef.set(1);
      await db.ref(`/secdata/${uid}/personal/promo/promo1/dataActivatedFrom`).set(activatedFrom);
      await db.ref(`/secdata/${uid}/personal/promo/promo1/dataActivatedTo`).set(activatedTo);
      await db.ref(`/secdata/${uid}/personal/activeCv`).set(1);

      // Zwracamy informacje do klienta
      return {
        message: 'Promocja została aktywowana.',
        dataActivatedFrom: activatedFrom,
        dataActivatedTo: activatedTo
      };
    }
  } catch (error) {
    console.error('Błąd w funkcji checkPromo:', error);
    throw new functions.https.HttpsError(
      'unknown',
      'Wystąpił błąd podczas przetwarzania żądania.'
    );
  }
});

//Integracje

exports.todoistIntegration = functions.region('europe-central2').https.onCall(async (data, context) => {
  const { apiToken, selectedProjectId, newProjectName } = data;
  const uid = context.auth.uid;

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    let tokenToUse;

    // If apiToken is provided, validate and save it
    if (apiToken) {
      // Validate the API token by fetching projects
      const projectsResponse = await axios.get('https://api.todoist.com/rest/v2/projects', {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
      const projects = projectsResponse.data;

      // Save the API token and projects to Realtime Database
      await admin.database().ref(`secdata/${uid}/personal/integrations/todoist`).set({
        apiToken: apiToken,
        projects: projects,
      });

      tokenToUse = apiToken;
    } else {
      // If no apiToken is provided, use the stored token to fetch projects
      const snapshot = await admin.database().ref(`secdata/${uid}/personal/integrations/todoist/apiToken`).once('value');
      tokenToUse = snapshot.val();

      if (!tokenToUse) {
        throw new functions.https.HttpsError('failed-precondition', 'API token is not available. Please provide a valid token.');
      }
    }

    let projects = [];

    // If newProjectName is provided, create a new project
    if (newProjectName) {
      const newProjectResponse = await axios.post(
        'https://api.todoist.com/rest/v2/projects',
        { name: newProjectName },
        {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
          },
        }
      );
      const newProject = newProjectResponse.data;

      // Fetch updated list of projects
      const projectsResponse = await axios.get('https://api.todoist.com/rest/v2/projects', {
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
      });
      projects = projectsResponse.data;

      // Update the Realtime Database with the new projects list
      await admin.database().ref(`secdata/${uid}/personal/integrations/todoist`).update({
        projects: projects,
      });
    } else {
      // Fetch projects using the stored or provided token
      const projectsResponse = await axios.get('https://api.todoist.com/rest/v2/projects', {
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
      });
      projects = projectsResponse.data;
    }

    // Update the selected project if provided
    if (selectedProjectId) {
      await admin.database().ref(`secdata/${uid}/personal/integrations/todoist`).update({
        selectedProjectId: selectedProjectId,
      });
    }

    // Return projects and selected project ID
    const integrationDataSnapshot = await admin.database().ref(`secdata/${uid}/personal/integrations/todoist`).once('value');
    const integrationData = integrationDataSnapshot.val();

    return {
      apiToken: tokenToUse,
      projects: projects,
      selectedProjectId: integrationData.selectedProjectId || null,
    };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', 'Failed to integrate with Todoist', error);
  }
});

exports.exportTasksToTodoist = functions.region('europe-central2').https.onCall(async (data, context) => {
  const uid = context.auth.uid;

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Pobierz zapisany token API i aktywny projekt z Realtime Database
    const snapshot = await admin.database().ref(`secdata/${uid}/personal/integrations/todoist`).once('value');
    const integrationData = snapshot.val();

    if (!integrationData || !integrationData.apiToken || !integrationData.selectedProjectId) {
      throw new functions.https.HttpsError('failed-precondition', 'API token or selected project is not available.');
    }

    const apiToken = integrationData.apiToken;
    const selectedProjectId = integrationData.selectedProjectId;
    const { projectName, date, tasks } = data;

    // Dodaj główne zadanie do wybranego projektu w Todoist
    const mainTaskResponse = await axios.post(
      'https://api.todoist.com/rest/v2/tasks',
      {
        content: `${date} - ${projectName}`,
        project_id: selectedProjectId,
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );
    const mainTask = mainTaskResponse.data;

    // Przechodzimy przez każdą sekcję i dodajemy podzadania
    for (const section of tasks) {
      const sectionTitle = section.sectionTitle;
      const sectionDescription = section.sectionDescription;

      // Dodajemy sekcję jako podzadanie głównego zadania
      const sectionTaskResponse = await axios.post(
        'https://api.todoist.com/rest/v2/tasks',
        {
          content: `${sectionTitle}: ${sectionDescription}`,
          parent_id: mainTask.id,
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      const sectionTask = sectionTaskResponse.data;

      // Dodajemy wszystkie podzadania w ramach tej sekcji
      for (const task of section.tasks) {
        await axios.post(
          'https://api.todoist.com/rest/v2/tasks',
          {
            content: task.name,
            parent_id: sectionTask.id,
            due_date: task.dueDate || undefined,
          },
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
          }
        );
      }
    }

    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', 'Failed to export tasks to Todoist', error);
  }
});

exports.checkTodoistIntegration = functions.region('europe-central2').https.onCall(async (data, context) => {
  const uid = context.auth.uid;

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Pobierz zapisane dane integracji z Realtime Database
    const snapshot = await admin.database().ref(`secdata/${uid}/personal/integrations/todoist`).once('value');
    const integrationData = snapshot.val();

    if (!integrationData || !integrationData.apiToken || !integrationData.selectedProjectId) {
      return { hasIntegration: false };
    }

    return { hasIntegration: true };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', 'Failed to check Todoist integration', error);
  }
});

exports.asanaIntegration = functions.region('europe-central2').https.onCall(async (data, context) => {
  const { apiToken, selectedProjectId, newProjectName } = data;
  const uid = context.auth.uid;

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    let tokenToUse;

    // If apiToken is provided, validate and save it
    if (apiToken) {
      // Validate the API token by fetching projects
      const projectsResponse = await axios.get('https://app.asana.com/api/1.0/projects', {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
      const projects = projectsResponse.data.data;

      // Save the API token and projects to Realtime Database
      await admin.database().ref(`secdata/${uid}/personal/integrations/asana`).set({
        apiToken: apiToken,
        projects: projects,
      });

      tokenToUse = apiToken;
    } else {
      // If no apiToken is provided, use the stored token to fetch projects
      const snapshot = await admin.database().ref(`secdata/${uid}/personal/integrations/asana/apiToken`).once('value');
      tokenToUse = snapshot.val();

      if (!tokenToUse) {
        throw new functions.https.HttpsError('failed-precondition', 'API token is not available. Please provide a valid token.');
      }
    }

    let projects = [];

    // If newProjectName is provided, create a new project
    if (newProjectName) {
      const newProjectResponse = await axios.post(
        'https://app.asana.com/api/1.0/projects',
        { name: newProjectName },
        {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
          },
        }
      );
      const newProject = newProjectResponse.data.data;

      // Fetch updated list of projects
      const projectsResponse = await axios.get('https://app.asana.com/api/1.0/projects', {
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
      });
      projects = projectsResponse.data.data;

      // Update the Realtime Database with the new projects list
      await admin.database().ref(`secdata/${uid}/personal/integrations/asana`).update({
        projects: projects,
      });
    } else {
      // Fetch projects using the stored or provided token
      const projectsResponse = await axios.get('https://app.asana.com/api/1.0/projects', {
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
      });
      projects = projectsResponse.data.data;
    }

    // Update the selected project if provided
    if (selectedProjectId) {
      await admin.database().ref(`secdata/${uid}/personal/integrations/asana`).update({
        selectedProjectId: selectedProjectId,
      });
    }

    // Return projects and selected project ID
    const integrationDataSnapshot = await admin.database().ref(`secdata/${uid}/personal/integrations/asana`).once('value');
    const integrationData = integrationDataSnapshot.val();

    return {
      apiToken: tokenToUse,
      projects: projects,
      selectedProjectId: integrationData.selectedProjectId || null,
    };
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Asana API error:', error.response.data);
    } else {
      console.error('Unknown error:', error);
    }
    throw new functions.https.HttpsError('unknown', 'Failed to integrate with Asana', error);
  }
});

// Firebase Function to export tasks to Asana
exports.exportTasksToAsana = functions.region('europe-central2').https.onCall(async (data, context) => {
  const uid = context.auth.uid;

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Pobierz zapisany token API i aktywny projekt z Realtime Database
    const snapshot = await admin.database().ref(`secdata/${uid}/personal/integrations/asana`).once('value');
    const integrationData = snapshot.val();

    if (!integrationData || !integrationData.apiToken || !integrationData.selectedProjectId) {
      throw new functions.https.HttpsError('failed-precondition', 'API token or selected project is not available.');
    }

    const apiToken = integrationData.apiToken;
    const selectedProjectId = integrationData.selectedProjectId;
    const { projectName, date, tasks } = data;

    // Dodaj główne zadanie do wybranego projektu w Asana
    const mainTaskResponse = await axios.post(
      'https://app.asana.com/api/1.0/tasks',
      {
        name: `${projectName}`,  // Skróć nazwę, aby uniknąć potencjalnych problemów z długimi opisami
        projects: [selectedProjectId],  // Upewnij się, że przekazujemy tablicę z prawidłowym ID projektu
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );
    const mainTask = mainTaskResponse.data.data;

    // Przechodzimy przez każdą sekcję i dodajemy podzadania
    for (const section of tasks) {
      const sectionTitle = section.sectionTitle;
      const sectionDescription = section.sectionDescription;

      // Dodajemy sekcję jako podzadanie głównego zadania
      const sectionTaskResponse = await axios.post(
        'https://app.asana.com/api/1.0/tasks',
        {
          name: `${sectionTitle}: ${sectionDescription}`,
          parent: mainTask.gid,
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      const sectionTask = sectionTaskResponse.data.data;

      // Dodajemy wszystkie podzadania w ramach tej sekcji
      for (const task of section.tasks) {
        await axios.post(
          'https://app.asana.com/api/1.0/tasks',
          {
            name: task.name,
            parent: sectionTask.gid,
            due_on: task.dueDate || undefined,
          },
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
          }
        );
      }
    }

    return { success: true };
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Asana API error:', error.response.data);
    } else {
      console.error('Unknown error:', error);
    }
    throw new functions.https.HttpsError('unknown', 'Failed to export tasks to Asana', error);
  }
});

//symulator rozmowy

exports.processAudio = functions.database.ref('/audioMessages/{messageId}').onCreate(async (snapshot, context) => {
        const textData = snapshot.val().audioData; // Zakładamy, że audioData to transkrypcja tekstowa

        const ws = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01", {
            headers: {
                "Authorization": "Bearer sk-proj-ZqnrHngiZsx2EW2BYJQsT3BlbkFJyfLgNHCd7jSVAO7a4prR",
                "OpenAI-Beta": "realtime=v1",
            },
        });

        ws.on("open", function open() {
            // Wyślij tekst jako wiadomość z prośbą o odpowiedź w formie tekstowej i audio
            ws.send(JSON.stringify({
                type: 'response.create',
                response: {
                    modalities: ["text", "audio"],
                    instructions: "Proszę odpowiedzieć użytkownikowi.",
                    voice: "alloy",
                    output_audio_format: "pcm16",
                }
            }));
        });

        ws.on("message", function incoming(message) {
            const response = JSON.parse(message);
            console.log(response);

            if (response.type === 'response.done') {
                const responseText = response.response?.output?.find(item => item.type === 'message')?.content?.find(content => content.type === 'text')?.text;
                const responseAudio = response.response?.output?.find(item => item.type === 'message')?.content?.find(content => content.type === 'audio')?.audio;

                if (responseText) {
                    // Zapisz odpowiedź tekstową do Firebase
                    snapshot.ref.update({ responseText });
                }
                if (responseAudio) {
                    // Zapisz odpowiedź audio do Firebase
                    snapshot.ref.update({ responseAudio });
                }
            }
        });

        ws.on("error", (error) => {
            console.error('WebSocket error: ', error);
        });
    });
//funkcje wywoływane z innych

exports.saveUserRating = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '2GB' }).https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  const { key, rating, ratingId } = data;

  if (!uid || !rating || !ratingId) {
    throw new functions.https.HttpsError('invalid-argument', 'UID, rating, and ratingId must be provided.');
  }

  try {
    const userRatingRef = admin.database().ref(`transcriptions/${uid}/${key}/`);
    await userRatingRef.update({ [ratingId]: rating });
    
    //return { message: 'Rating saved successfully.' };
  } catch (error) {
    console.error('Error saving rating:', error);
    throw new functions.https.HttpsError('internal', 'Failed to save rating.');
  }
});

exports.getUserRating = functions.region('europe-central2').https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  const { key, ratingId } = data;

  if (!uid || !ratingId) {
    throw new functions.https.HttpsError('invalid-argument', 'UID and ratingId must be provided.');
  }

  try {
    const userRatingRef = admin.database().ref(`transcriptions/${uid}/${key}/${ratingId}`);
    const snapshot = await userRatingRef.once('value');
    const rating = snapshot.val() || 0;
    return { rating };
    
  } catch (error) {
    console.error('Error fetching rating:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch rating.');
  }
});



exports.setVectorFile = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '2GB' }).https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  //const fineTune = await openai.fineTuning.jobs.create({
  //  training_file: 'file-sImuhOjUH7oU4bs4vvvmmUb4',
  //  model: 'gpt-4o-mini-2024-07-18'
  //});

  // Sprawdzenie UID
  if (!uid) {
    throw new functions.https.HttpsError('failed-precondition', 'Nie można uzyskać dostępu bez odpowiedniego UID.');
  }
  await checkAndCreateAssistant(uid);
  try {
    // Pobranie wartości z bazy danych
    const vectorSnapshot = await admin.database().ref(`secdata/${uid}/personal/VectorStoreUpdated`).once('value');
    const vectorVal = vectorSnapshot.val();
    const vectorNeuroSnapshot = await admin.database().ref(`secdata/${uid}/personal/VectorStoreNeuroUpdated`).once('value');
    const vectorNeuroVal = vectorNeuroSnapshot.val();
    const vectorCvSnapshot = await admin.database().ref(`secdata/${uid}/personal/VectorStoreCvUpdated`).once('value');
    const vectorCvVal = vectorCvSnapshot.val();

    // Sprawdzenie warunku i generowanie transkrypcji
    if (vectorVal !== 1) {
      await generateTranscriptionsToAssistant(uid);
      console.log("Generowanie Transkrypcji: " + uid)


    }
        // Sprawdzenie warunku i generowanie Neuro
        if (vectorNeuroVal !== 1) {
          await generateTestToAssistant(uid);
          console.log("Generowanie Testów: " + uid)
    
        }
        // Sprawdzenie warunku i generowanie Cv
        if (vectorCvVal !== 1) {
          await generateCvBuddyToAssistant(uid);
          console.log("Generowanie cv: " + uid)
    
        }

      

    // Zwrócenie odpowiedzi do klienta
    return { message: "Operacja zakończona pomyślnie." };
  } catch (error) {
    console.error('Błąd podczas ustawiania pliku wektora:', error);
    throw new functions.https.HttpsError('internal', 'Wystąpił błąd podczas przetwarzania.');
  }
});


exports.assistantChat = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '2GB' }).https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  const { positionid, message } = data;
  let threadIdVal;
  let conspekt;


  if (positionid === "fullChat") {
          // Pobierz lub utwórz nowy wątek
          const threadId = await admin.database().ref(`secdata/${uid}/personal/threads/fn`).once('value');
          if (!threadId.exists()) {
              const threadAdd = await openai.beta.threads.create({
                  messages: [
                      {
                          role: "user",
                          content: `Imię asystenta: Dzieny Asystent. `
                      },
                      {
                        role: "user",
                        content: `Zamiast podawać w odpowiedziach id nagrań podawaj ich tytuły. `
                    }
    
                  ],
              });
              threadIdVal = threadAdd.id;
              
              //const childRefThread = admin.database().ref(`transcriptions/${uid}/${positionid}`);
              //await childRefThread.update({
               //   newThreadTrans: threadIdVal
              //});
          } else {
              threadIdVal = threadId.val();
          }
    


  } else {
      // Pobierz lub utwórz nowy wątek
      const threadId = await admin.database().ref(`transcriptions/${uid}/${positionid}/newThreadTrans`).once('value');
      if (!threadId.exists()) {
          const threadAdd = await openai.beta.threads.create({
              messages: [
                  {
                      role: "user",
                      content: `Imię asystenta: Dzieny Asystent. Rozmowa dotyczy transkrypcji nagrania o id: ${positionid}. `
                  },
                  {
                    role: "user",
                    content: `Zamiast podawać w odpowiedziach id nagrań podawaj ich tytuły. `
                }

              ],
          });
          threadIdVal = threadAdd.id;
          conspekt = ` Udzielaj odpowiedzi głównie dotyczących transkrypcji nagrania o id: ${positionid} `;
          
          const childRefThread = admin.database().ref(`transcriptions/${uid}/${positionid}`);
          await childRefThread.update({
              newThreadTrans: threadIdVal
          });
      } else {
          threadIdVal = threadId.val();
      }

    
  }

  if (!uid) {
      throw new functions.https.HttpsError('invalid-argument', 'UID must be provided.');
  }

  try {
      const assistantId = await admin.database().ref(`secdata/${uid}/personal/assistantOpenAiFn`).once('value');
      const assistantIdVal = assistantId.val();
      const assistantName = await admin.database().ref(`secdata/${uid}/personal/assistantName`).once('value');
      const assistantNameVal = assistantName.val() || "Twój Osobisty Asystent";

      const now = new Date();
const date = now.toLocaleDateString("pl-PL");
const time = now.toLocaleTimeString("pl-PL");

console.log(`Dzisiejsza data: ${date}`);
console.log(`Aktualna godzina: ${time}`);


      // Dodaj wiadomość użytkownika do wątku
      await openai.beta.threads.messages.create(
          threadIdVal,
          {
              role: "user",
              content: `Imię asystenta: ${assistantNameVal}. Dzisiejsza data to ${date} i godzina: ${time}. ` + message
          }
      );
      const runAddInstruction = `Dzisiejsza data to ${date} i godzina: ${time}. Analizuj załączone transkrypcje spotkań ${conspekt}, projektów lub innych nagrań oraz wyniki testów psychologicznych jednego użytkownika. Wykorzystuj pliki przechowywane w vector store OpenAI. W odpowiedziach nie podawaj źródeł ani linków do plików, a jedynie uwzględniaj ich zawartość. Odpowiedzi powinny być konkretne i pełne, zawierać jasne wnioski oraz praktyczne rekomendacje.
Zadania Asystenta:
Analiza Transkrypcji:
Przeglądaj i podsumowuj kluczowe punkty z transkrypcji.
Identyfikuj zadania do wykonania oraz wymagania dalszych działań.
Analiza Wyników Testów Psychologicznych:

Zbieraj i analizuj wyniki testów psychologicznych.
Dostarczaj wnioski lub rekomendacje na podstawie analizy wyników.
Tworzenie Zależności między Dokumentami:

Identifikuj i definiuj relacje między transkrypcjami a wynikami testów psychologicznych.
Dokumentuj, jak te interakcje mogą wspierać użytkownika w osiąganiu jego celów.

`;

      // Tworzenie run z streamowaniem
      const run = await openai.beta.threads.runs.create(
          threadIdVal,
          { assistant_id: assistantIdVal,
            instructions: runAddInstruction
          }
      );

      const runId = run.id;

      let runCheck = await openai.beta.threads.runs.retrieve(
        threadIdVal,
        runId
      );

      const maxAttempts = 300;
      let attempts = 0;
      let contentAssist = "";

      while (attempts < maxAttempts) {
        if (runCheck.status === "completed") {
          const threadMessages = await openai.beta.threads.messages.list(threadIdVal);
          const filteredMessages = threadMessages.data.filter(
            (message) => message.role === "assistant" && message.run_id === runId
          );
      console.log("attempts: " + attempts);
          // Wyświetlamy wartość 'value' z pola 'content'
          filteredMessages.forEach((message) => {
            message.content.forEach((contentItem) => {
              if (contentItem.type === "text") {
                console.log(contentItem.text.value);
                contentAssist = contentItem.text.value
              }
            });
          });
          break; // Zakończ pętlę, gdy status jest 'completed'
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            contentAssist = "Nie byłem w stanie udzielić odpowiedzi w maksymalnie okreslonym czasie. Ogranicz konieczność analizy do mniejszego zakresu, i spróbuj ponownie. Przepraszam za niedogodność. Twój Asystent AI.";
            console.error(
              'Błąd: Status nie zmienił się na "completed" po 300 próbach.'
            );
            return {contentAssist}
            
          }
          // Poczekaj 10 sekund przed kolejną próbą
          await new Promise((resolve) => setTimeout(resolve, 2000));
      
          // Odśwież status runCheck
          runCheck = await openai.beta.threads.runs.retrieve(
            threadIdVal,
            runId
          );
        }
      }
return {contentAssist}
  } catch (error) {
      console.error('Error processing assistant chat:', error);
      throw new functions.https.HttpsError('internal', 'Failed to process assistant chat.');
  }
});






//AssistantsDocs
exports.generateTranscriptionsPdf = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '2GB' }).https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  await generateTranscriptionsToAssistant(uid)
 
});

exports.delSingleTranscription = functions.region('europe-central2').runWith({ timeoutSeconds: 540, memory: '2GB' }).https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  const key = data.key;
  console.log(uid, key);
  //await generateTranscriptionsToAssistant(uid)
try {
    // Sprawdź, czy w transcriptions/{uid}/{key} znajduje się pole fileId
    const transcriptionRef = db.ref(`transcriptions/${uid}/${key}`);
    const transcriptionSnapshot = await transcriptionRef.once('value');
    const transcription = transcriptionSnapshot.val();

    if (!transcription) {
      throw new Error('No transcription data found for the given key.');
    }

    if (transcription.fileId) {
      // Usuń plik w OpenAI
      console.log("fileId - OpenAI: " + transcription.fileId);
      const delFileId = await openai.files.del(transcription.fileId);
      console.log("DEL fileId - OpenAI: " + JSON.stringify(delFileId));
    }

    
      transcriptionRef.remove()
        .then(() => {
        console.log('Item successfully deleted');
        // Usuń element z interfejsu użytkownika
        })
        .catch((error) => console.log('Failed to delete item: ', error));


} catch (error) {
  console.error('Błąd aktualizacji transkrypcji:', error);
  throw new Error('Nie udało się zaktualizować transkrypcji.');
}
 
});

async function generateTranscriptionsToAssistant(uid) {
  const dbRef = admin.database().ref();
  if (!uid) {
    throw new Error('User UID must be provided.');
  }

  try {
    // Pobierz dane transkrypcji z Realtime Database
    const transcriptionsRef = dbRef.child(`transcriptions/${uid}`);
    const transcriptionsSnapshot = await transcriptionsRef.once('value');
    const transcriptions = transcriptionsSnapshot.val();

    if (!transcriptions) {
      return;
      //throw new Error('No transcription data found for the user.');
    }

    // Pobierz wartość vector_store_ids
    const vectorStoreRef = dbRef.child(`secdata/${uid}/personal/vector_store_ids`);
    const vectorStoreSnapshot = await vectorStoreRef.once('value');
    const vectorStoreId = vectorStoreSnapshot.val();

    if (!vectorStoreId) {
      throw new Error('No vector store ID found for the user.');
    }

    // Iteracja po każdej transkrypcji, która zaczyna się od znaku '-' i generowanie osobnych plików TXT sekwencyjnie
    for (const key of Object.keys(transcriptions)) {
      if (!key.startsWith('-')) {
        continue;
      }
      const transcription = transcriptions[key];
      const { fileContentVerbose, fileContentVerboseNew, title, date, summaryclean, sumAdvAi, summaryPre, summaryQue, summaryPreRating, summaryAdvRating, summaryQueRating } = transcription;

      // Treść pliku TXT
      const txtContent = `Transkrypcja ID: ${key}
Tytuł transkrypcji ${key}: ${title || 'Brak'}
Data nagrania: ${date ? new Date(date).toLocaleString('pl-PL') : 'Brak'}

Pełne brzmienie transkrypcji ${key}: ${fileContentVerboseNew || fileContentVerbose}

Krótkie podsumowanie transkrypcji ${key}: ${summaryclean || 'Brak'}

Analiza metodą Cornell transkrypcji ${key}: ${summaryPre || 'Brak'}
Ocena analizy metodą Cornell (w skali 1-5): ${summaryPreRating || 'Brak'}

Analiza SMART transkrypcji ${key}: ${sumAdvAi || 'Brak'}
Ocena Analizy Smart (w skali 1-5): ${summaryAdvRating || 'Brak'}

Podsumowanie metodą Pytań i odpowiedzi transkrypcji ${key}: ${summaryQue || 'Brak'}
Ocena Podsumowania metodą Pytań i odpowiedzi (w skali 1-5): ${summaryQueRating || 'Brak'}
`;

      // Zapisz treść do lokalnego pliku tymczasowego
      const tempFilePath = path.join(os.tmpdir(), `${key}.txt`);
      fsdemo.writeFileSync(tempFilePath, txtContent, 'utf-8');

      // Wyślij plik do OpenAI
      const fileResponse = await openai.files.create({
        file: fsdemo.createReadStream(tempFilePath),
        purpose: 'assistants',
      });
      console.log(JSON.stringify(fileResponse));

      const fileId = fileResponse.id;

      // Utwórz vector store w OpenAI
      const myVectorStoreFile = await openai.beta.vectorStores.files.create(vectorStoreId, {
        file_id: fileId,
      });

      // Zaktualizuj pole fileId w transcriptions/{uid}/{key}
      const fileOpenAiId = dbRef.child(`transcriptions/${uid}/${key}`);
      await fileOpenAiId.update({ fileId });
    }

    const personalRef = dbRef.child(`secdata/${uid}/personal`);
    await personalRef.update({ VectorStoreUpdated: 1 });

    return { message: 'Pliki TXT wygenerowane, wysłane do OpenAI i zapisane pomyślnie.' };
  } catch (error) {
    console.error('Błąd generowania plików TXT:', error);
    throw new Error('Nie udało się wygenerować plików TXT.');
  }
}

async function generateTestToAssistant(uid) {
  const dbRef = admin.database().ref();
  if (!uid) {
    throw new Error('User UID must be provided.');
  }

  try {
    // Pobierz dane wyników testów z Realtime Database
    const testsRef = dbRef.child(`Neuroinsights/${uid}`);
    const testsSnapshot = await testsRef.once('value');
    const tests = testsSnapshot.val();

    if (!tests) {
      return;
     // throw new Error('No test data found for the user.');
    }

    // Pobierz wartość vector_store_ids
    const vectorStoreRef = dbRef.child(`secdata/${uid}/personal/vector_store_ids`);
    const vectorStoreSnapshot = await vectorStoreRef.once('value');
    const vectorStoreId = vectorStoreSnapshot.val();

    if (!vectorStoreId) {
      throw new Error('No vector store ID found for the user.');
    }

    // Filtracja testów - pobierz tylko te z najnowszą datą dla każdego typu testu
    const latestTests = {};
    Object.keys(tests).forEach(testName => {
      const testResults = tests[testName];
      let latestResult = null;

      Object.keys(testResults).forEach(resultKey => {
        const result = testResults[resultKey];
        if (!latestResult || result.date > latestResult.date) {
          latestResult = { ...result, key: resultKey };
        }
      });

      if (latestResult) {
        latestTests[testName] = latestResult;
      }
    });

    // Generowanie pliku TXT z wynikami najnowszych testów
     // Generowanie pliku TXT z analizami ogłoszeń i CV
     let txtContent = 'W  dalszej czesci pliku znajdują sie wyniki testów psychologicznych i osobowościowych użytkownika.';
    Object.keys(latestTests).forEach(testName => {
      const test = latestTests[testName];
      const { date, comment, wskazniki, wyjasnienia } = test;

      txtContent += `Nazwa testu: ${testName}
`;
      txtContent += `Data wykonania testu: ${date ? new Date(date).toLocaleString('pl-PL') : 'Brak'}
`;
      txtContent += `Wynik testu: ${comment || 'Brak'}
`;
      txtContent += `Wskaźniki wyników testu: ${wskazniki || 'Brak'}
`;
      txtContent += `Dodatkowe wyjaśnienia wskaźników: ${wyjasnienia || 'Brak'}
`;
      txtContent += `
----------------------------------------
`;
    });

    // Zapisz treść do lokalnego pliku tymczasowego
    const tempFilePath = path.join(os.tmpdir(), `latest_tests.txt`);
    fsdemo.writeFileSync(tempFilePath, txtContent, 'utf-8');

    // Wyślij plik do OpenAI
    const fileResponse = await openai.files.create({
      file: fsdemo.createReadStream(tempFilePath),
      purpose: 'assistants',
    });
    console.log(JSON.stringify(fileResponse));

    const fileId = fileResponse.id;

    // Utwórz vector store w OpenAI
    const myVectorStoreFile = await openai.beta.vectorStores.files.create(vectorStoreId, {
      file_id: fileId,
    });

    // Zaktualizuj pole fileId w secdata/{uid}/personal
    const personalRef = dbRef.child(`secdata/${uid}/personal`);
    await personalRef.update({ fileId, VectorStoreNeuroUpdated: 1 });

    return { message: 'Plik TXT z najnowszymi wynikami testów wygenerowany, wysłany do OpenAI i zapisany pomyślnie.' };
  } catch (error) {
    console.error('Błąd generowania pliku TXT:', error);
    throw new Error('Nie udało się wygenerować pliku TXT.');
  }
}

async function generateCvBuddyToAssistant(uid) {
  const dbRef = admin.database().ref();
  if (!uid) {
    throw new Error('User UID must be provided.');
  }

  try {
    // Pobierz dane analiz ogłoszeń z Realtime Database
    const cvBuddyRef = dbRef.child(`cvBuddy/${uid}/cvProject`);
    const cvBuddySnapshot = await cvBuddyRef.once('value');
    const cvBuddyData = cvBuddySnapshot.val();

    if (!cvBuddyData) {
      return;
      throw new Error('No CV Buddy data found for the user.');
    }

    // Pobierz wartość vector_store_ids
    const vectorStoreRef = dbRef.child(`secdata/${uid}/personal/vector_store_ids`);
    const vectorStoreSnapshot = await vectorStoreRef.once('value');
    const vectorStoreId = vectorStoreSnapshot.val();

    if (!vectorStoreId) {
      throw new Error('No vector store ID found for the user.');
    }

    // Generowanie pliku TXT z analizami ogłoszeń i CV
    let txtContent = 'W dalszej części pliku znajdują się analizy ogłoszeń o pracę na które uzytkownik chce aplikować czyli ista procesów rekrutacyjnych użytkownika.';

    Object.keys(cvBuddyData).forEach(key => {
      const entry = cvBuddyData[key];
      const {
        title,
        date,
        ShortJobCompany,
        ShortJobDesc,
        cvAnal,
        cvLm,
        cvRecommended,
        dopasowaniePre,
        dopasowaniePost,
        completed
      } = entry;

      txtContent += `Id analizy i rekrutacji dopasowania ogłoszenia o prace do użytkownika: ${key}
`;
txtContent += `Nazwa stanowiska na które uzytkownik aplikuje: ${title || 'Brak'}
`;
      txtContent += `Data wprowadzenia ogłoszenia: ${date ? new Date(date).toLocaleString('pl-PL') : 'Brak'}
`;
      txtContent += `Nazwa firmy: ${ShortJobCompany || 'Brak'}
`;
      txtContent += `Podsumowanie ogłoszenia o pracę: ${ShortJobDesc || 'Brak'}
`;
      txtContent += `Ocena dopasowania CV do ogłoszenia opracowana przez AI: ${cvAnal || 'Brak'}
`;
      txtContent += `Rekomendowany List Motywacyjny opracowany przez AI: ${cvLm || 'Brak'}
`;
      txtContent += `Rekomendowane brzmienie CV opracowane przez AI: ${cvRecommended || 'Brak'}
`;
      txtContent += `Dopasowanie pierwotnego CV do ogłoszenia o pracę (0-100): ${dopasowaniePre != null ? dopasowaniePre : 'Brak'}
`;
      txtContent += `Dopasowanie CV po rekomendacjach (0-100): ${dopasowaniePost != null ? dopasowaniePost : 'Brak'}
`;
      txtContent += `Aplikacja wysłana: ${completed ? 'Tak' : 'Nie'}
`;
      txtContent += `
----------------------------------------
`;
    });

    // Zapisz treść do lokalnego pliku tymczasowego
    const tempFilePath = path.join(os.tmpdir(), `cv_buddy_analysis.txt`);
    fsdemo.writeFileSync(tempFilePath, txtContent, 'utf-8');

    // Wyślij plik do OpenAI
    const fileResponse = await openai.files.create({
      file: fsdemo.createReadStream(tempFilePath),
      purpose: 'assistants',
    });
    console.log(JSON.stringify(fileResponse));

    const fileId = fileResponse.id;

    // Utwórz vector store w OpenAI
    const myVectorStoreFile = await openai.beta.vectorStores.files.create(vectorStoreId, {
      file_id: fileId,
    });

    // Zaktualizuj pole fileId w secdata/{uid}/personal
    const personalRef = dbRef.child(`secdata/${uid}/personal`);
    await personalRef.update({ fileId, VectorStoreCvUpdated: 1 });

    return { message: 'Plik TXT z analizami ogłoszeń i CV wygenerowany, wysłany do OpenAI i zapisany pomyślnie.' };
  } catch (error) {
    console.error('Błąd generowania pliku TXT:', error);
    throw new Error('Nie udało się wygenerować pliku TXT.');
  }
}



async function updateSingleTranscription(uid, key) {
  const dbRef = admin.database().ref();
  if (!uid || !key) {
    throw new Error('User UID and key must be provided.');
  }

  try {
    // Sprawdź, czy w transcriptions/{uid}/{key} znajduje się pole fileId
    const transcriptionRef = db.ref(`transcriptions/${uid}/${key}`);
    const transcriptionSnapshot = await transcriptionRef.once('value');
    const transcription = transcriptionSnapshot.val();

    if (!transcription) {
      throw new Error('No transcription data found for the given key.');
    }

    if (transcription.fileId) {
      // Usuń plik w OpenAI
      await openai.files.del(transcription.fileId);

    }

    // Pobierz wartość vector_store_ids
    const vectorStoreRef = db.ref(`secdata/${uid}/personal/vector_store_ids`);
    const vectorStoreSnapshot = await vectorStoreRef.once('value');
    const vectorStoreId = vectorStoreSnapshot.val();

    if (!vectorStoreId) {
      throw new Error('No vector store ID found for the user.');
    }

    const { fileContentVerboseNew, title, date, summaryclean, sumAdvAi, summaryPre, summaryQue, summaryPreRating, summaryAdvRating, summaryQueRating } = transcription;

    // Treść pliku TXT
    const txtContent = `Transkrypcja ID: ${key}
Tytuł transkrypcji ${key}: ${title || 'Brak'}
Data nagrania: ${date ? new Date(date).toLocaleString('pl-PL') : 'Brak'}

Pełne brzmienie transkrypcji ${key}: ${fileContentVerboseNew || 'Brak'}

Krótkie podsumowanie transkrypcji ${key}: ${summaryclean || 'Brak'}

Analiza metodą Cornell transkrypcji ${key}: ${summaryPre || 'Brak'}
Ocena analizy metodą Cornell (w skali 1-5): ${summaryPreRating || 'Brak'}

Analiza SMART transkrypcji ${key}: ${sumAdvAi || 'Brak'}
Ocena Analizy Smart (w skali 1-5): ${summaryAdvRating || 'Brak'}

Podsumowanie metodą Pytań i odpowiedzi transkrypcji ${key}: ${summaryQue || 'Brak'}
Ocena Podsumowania metodą Pytań i odpowiedzi (w skali 1-5): ${summaryQueRating || 'Brak'}
`;

//const metaToVectorVal = await metaToVector(txtContent);

    // Zapisz treść do lokalnego pliku tymczasowego
    const tempFilePath = path.join(os.tmpdir(), `${key}.txt`);
    fsdemo.writeFileSync(tempFilePath, txtContent, 'utf-8');

    // Wyślij plik do OpenAI
    const fileResponse = await openai.files.create({
      file: fsdemo.createReadStream(tempFilePath),
      purpose: 'assistants',
    });
    console.log(JSON.stringify(fileResponse));

    const fileId = fileResponse.id;

    // Utwórz vector store w OpenAI
    const myVectorStoreFile = await openai.beta.vectorStores.files.create(vectorStoreId, {
      file_id: fileId,
    });

    // Zaktualizuj pole fileId w transcriptions/{uid}/{key}
    await transcriptionRef.update({ fileId });

    const personalRef = dbRef.child(`secdata/${uid}/personal`);
    await personalRef.update({ VectorStoreUpdated: 1 });

    return { message: 'Plik TXT wygenerowany, wysłany do OpenAI i zapisany pomyślnie.' };
  } catch (error) {
    console.error('Błąd aktualizacji transkrypcji:', error);
    throw new Error('Nie udało się zaktualizować transkrypcji.');
  }
}

async function checkUserActivityLevel(uid) {
  try {
      const dbRef = admin.database().ref();

      // 1. Zliczanie testów w /Neuroinsights/{uid}
      const neuroinsightsRef = dbRef.child(`Neuroinsights/${uid}`);
      const neuroinsightsSnapshot = await neuroinsightsRef.once('value');
      let testCount = 0;

      neuroinsightsSnapshot.forEach(childSnapshot => {
          childSnapshot.forEach(() => {
              testCount++;  // Zliczamy wszystkie testy w ramach każdego klucza
          });
      });

      console.log(`Liczba testów dla ${uid}:`, testCount);

      // 2. Zliczanie transkrypcji w /transcriptions/${uid}
      const transcriptionsRef = dbRef.child(`transcriptions/${uid}`);
      const transcriptionsSnapshot = await transcriptionsRef.once('value');
      let transcriptionCount = 0;

      transcriptionsSnapshot.forEach(() => {
          transcriptionCount++;  // Zliczamy transkrypcje
      });

      console.log(`Liczba transkrypcji dla ${uid}:`, transcriptionCount);

      // 3. Zliczanie ogłoszeń o pracę w /cvbuddy/{uid}/cvProject
      const jobAdsRef = dbRef.child(`cvBuddy/${uid}/cvProject`);
      const jobAdsSnapshot = await jobAdsRef.once('value');
      let jobAdCount = 0;

      jobAdsSnapshot.forEach(() => {
          jobAdCount++;  // Zliczamy ogłoszenia
      });

      console.log(`Liczba ogłoszeń o pracę dla ${uid}:`, jobAdCount);

      // 4. Obliczenie sumy testów, transkrypcji i ogłoszeń
      const totalCount = testCount + transcriptionCount + jobAdCount;
      console.log(`Łączna liczba testów, transkrypcji i ogłoszeń dla ${uid}:`, totalCount);

      // 5. Ustawienie poziomu activeLevel na podstawie sumy
      let activeLevel = 0;
      if (totalCount > 150) {
          activeLevel = 5;
      } else if (totalCount > 50) {
        activeLevel = 4;
      } else if (totalCount > 30) {
          activeLevel = 3;
      } else if (totalCount > 10) {
          activeLevel = 2;
      } else if (totalCount > 3) {
          activeLevel = 1;
      } 

      // 6. Zapisanie activeLevel w /secdata/{uid}/personal
      const personalRef = dbRef.child(`secdata/${uid}/personal`);
      await personalRef.update({ activeLevel, totalCount, jobAdCount, transcriptionCount, testCount });

      console.log(`Ustawiono activeLevel ${activeLevel} dla ${uid}`);

      return activeLevel;  // Zwracanie poziomu dla dalszego użycia
  } catch (error) {
      console.error(`Błąd podczas obliczania poziomu aktywności dla ${uid}:`, error);
      throw new functions.https.HttpsError('internal', 'Nie udało się obliczyć poziomu aktywności.');
  }
}

// Funkcja do stworzenia metadanych do plików
async function metaToVector(fullText) {

  const metaToVectorResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    response_format: { type: "json_object" },
    messages: [
      { role: 'user', content: `
        
        You are an AI assistant specialized in extracting metadata from various types of documents, including transcriptions, psychological test results, and application documents. Given the following document, extract the relevant metadata fields as specified below and provide them in JSON format.

### Document:
[Wklej tutaj treść dokumentu, np. transkrypcję]

### Required Metadata Fields:
- document_id: A unique identifier for the document.
- document_type: The category of the document (e.g., Transcription, CV, Psychological Test).
- user_id: The unique identifier of the user to whom the document is related.
- title: A short description or title of the document.
- creation_date: The date the document was created (format: YYYY-MM-DD).
- source: The origin of the document (e.g., Meeting Recording, CV File, Test Report).
- language: The language in which the document is written.
- tags_keywords: A list of keywords describing the document's content.
- confidentiality_level: The level of confidentiality (e.g., High, Medium, Low).
- last_updated: The date the document was last modified (format: YYYY-MM-DD).
- summary: A brief summary of the document's content.

### Instructions:
1. Analyze the provided document content.
2. Accurately extract each of the required metadata fields.
3. If certain metadata is not available or applicable in the document, set its value to "null".
4. Ensure the output is in valid JSON format and matches the structure of the example below.

### Example Output in JSON format:

{
  "document_id": "doc_12345",
  "document_type": "Transcription",
  "title": "Project Meeting Transcription - 2024-04-15",
  "creation_date": "2024-04-15",
  "source": "Meeting Recording",
  "language": "Polski",
  "tags_keywords": ["projektowanie", "zarządzanie", "analiza", "przywództwo"],
  "confidentiality_level": "High",
  "last_updated": "2024-04-16",
  "summary": "Transkrypcja codziennego spotkania zespołu, omówienie postępów projektowych ora
}                
        ` }

    ],
    temperature: 0.7,
  });

  const metaToVectorParsed = JSON.parse(metaToVectorResponse.choices[0].message);
  return metaToVectorParsed;

}

async function generateJSONL(transcription, uid, key, title, date) {
    /**
     * Generates a JSONL-formatted string where each spoken phrase is an individual line.
     *
     * @param {string} transcription - JSON string representing an array of transcription objects
     * @param {string} uid - Unique user identifier.
     * @param {string} key - Unique transcription identifier.
     * @param {string} title - Title of the recording.
     * @param {string} date - Date of the recording.
     * @returns {string} - JSONL formatted string with each spoken phrase as an individual line.
     */
    
    let parsedTranscription;
    
    // Parse the transcription if it's a string
    try {
        parsedTranscription = typeof transcription === 'string' ? JSON.parse(transcription) : transcription;
    } catch (error) {
        throw new Error('Failed to parse transcription JSON: ' + error.message);
    }

    // Ensure that parsedTranscription is an array
    if (!Array.isArray(parsedTranscription)) {
        throw new Error('Transcription must be an array');
    }

    let jsonlString = '';

    // Iterate through the parsed transcription and create a JSONL line for each phrase
    parsedTranscription.forEach((entry, index) => {
        if (!entry || !entry.text || !entry.speaker) {
            throw new Error('Each transcription entry must have "text" and "speaker" properties');
        }

        // Create a JSON line for each spoken phrase
        const jsonLine = JSON.stringify({
            messages: [
                { role: "system", content: `Transcription for user id ${uid}, transcription id ${key}_${index + 1}, title '${title}', recorded on ${date}.` },
                { role: "user", content: "Provide the transcription content." },
                { role: "assistant", content: `${entry.speaker}: ${entry.text}` }
            ]
        });

        // Append JSON line to the result string with a newline
        jsonlString += jsonLine + '\n';
    });
    console.log(jsonlString);

    return jsonlString.trim(); // Return final JSONL string
}






// Funkcja do zamiany tekstu na mowę z użyciem OpenAI API
async function textToSpeech(text) {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
      response_format: "opus",
    });

    const audioData = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioData).toString('base64');

    return audioBase64; // Zwracamy zakodowany dźwięk w base64
  } catch (error) {
    console.error("Error converting text to speech:", error);
    throw error;
  }
}

async function handleCheckoutSessionCompleted(session) {
  const userId = session.client_reference_id;
  const stripeCustomerId = session.customer;
  const subscriptionId = session.subscription;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await admin.firestore().collection('customers').doc(userId).set({
    stripeId: stripeCustomerId,
    subscription: {
      id: subscription.id,
      status: subscription.status,
      current_period_end: subscription.current_period_end,
      plan: subscription.items.data[0].plan.nickname,
    }
  }, { merge: true });

  console.log(`Subscription for user ${userId} has been updated.`);
}

async function handleInvoicePaymentSucceeded(invoice) {
  const subscriptionId = invoice.subscription;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const userId = (await admin.firestore().collection('customers')
    .where('subscription.id', '==', subscription.id)
    .get()).docs[0].id;

  await admin.firestore().collection('customers').doc(userId).update({
    'subscription.status': subscription.status,
    'subscription.current_period_end': subscription.current_period_end,
  });

  console.log(`Invoice payment succeeded for user ${userId}`);
}

async function handleSubscriptionCreated(subscription) {
  const userId = (await admin.firestore().collection('customers')
    .where('stripeId', '==', subscription.customer)
    .get()).docs[0].id;

  await admin.firestore().collection('customers').doc(userId).update({
    'subscription.id': subscription.id,
    'subscription.status': subscription.status,
    'subscription.current_period_end': subscription.current_period_end,
    'subscription.plan': subscription.items.data[0].plan.nickname,
  });

  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription) {
  const userId = (await admin.firestore().collection('customers')
    .where('stripeId', '==', subscription.customer)
    .get()).docs[0].id;

  await admin.firestore().collection('customers').doc(userId).update({
    'subscription.status': subscription.status,
    'subscription.current_period_end': subscription.current_period_end,
    'subscription.plan': subscription.items.data[0].plan.nickname,
  });

  console.log(`Subscription updated for user ${userId}`);
}

async function handleSubscriptionDeleted(subscription) {
  const userId = (await admin.firestore().collection('customers')
    .where('stripeId', '==', subscription.customer)
    .get()).docs[0].id;

  await admin.firestore().collection('customers').doc(userId).update({
    'subscription.status': 'canceled',
  });

  console.log(`Subscription deleted for user ${userId}`);
}

// Funkcja przetwarzania danych użytkownika
async function processUser(user, db, firestore, oneWeekAgo) {
  const uid = user.uid;
  const email = user.email || 'No email on file';
  let counts = {
    testsWeek: 0,
    testsTotal: 0,
    transcriptionsWeek: 0,
    transcriptionsTotal: 0,
    jobAnalysisWeek: 0,
    jobAnalysisTotal: 0,
    morningTestsWeek: 0,
    morningTestsTotal: 0,
    eveningTestsWeek: 0,
    eveningTestsTotal: 0
  };

  // Pobieranie i agregacja danych dla każdego użytkownika
  await Promise.all([
    aggregateNeuroinsights(db, `Neuroinsights/${uid}`, oneWeekAgo, counts),
    aggregateData(db, `transcriptions/${uid}`, oneWeekAgo, counts, 'transcriptions'),
    aggregateData(db, `cvBuddy/${uid}/cvProject`, oneWeekAgo, counts, 'jobAnalysis'),
    aggregateData(db, `wellBeingInsight/${uid}/wellMorningTest`, oneWeekAgo, counts, 'morningTests'),
    aggregateData(db, `wellBeingInsight/${uid}/wellEveningTest`, oneWeekAgo, counts, 'eveningTests')
  ]);

  // Konwersja liczników na stringi bez polskich znaków
  const reportData = {
    liczba_testow_tydzien: counts.testsWeek.toString(),
    liczba_testow_ogolem: counts.testsTotal.toString(),
    liczba_transkrypcji_tydzien: counts.transcriptionsWeek.toString(),
    liczba_transkrypcji_ogolem: counts.transcriptionsTotal.toString(),
    liczba_analiz_ogloszen_tydzien: counts.jobAnalysisWeek.toString(),
    liczba_analiz_ogloszen_ogolem: counts.jobAnalysisTotal.toString(),
    liczba_testow_porannych_tydzien: counts.morningTestsWeek.toString(),
    liczba_testow_porannych_ogolem: counts.morningTestsTotal.toString(),
    liczba_testow_wieczornych_tydzien: counts.eveningTestsWeek.toString(),
    liczba_testow_wieczornych_ogolem: counts.eveningTestsTotal.toString(),
  };

  // Zapisz dane do Firestore w kolekcji "mail" w losowym dokumencie
  await firestore.collection('mail').add({
    to: email,
    template: { 
      name: 'weeklyreport',
      data: reportData
    }
  });

  console.log(`Report for ${email} saved successfully.`);
}

// Funkcja do agregacji danych dla Neuroinsights (zliczanie wszystkich testów)
async function aggregateNeuroinsights(db, path, oneWeekAgo, counts) {
  const snapshot = await db.ref(path).once('value');
  snapshot.forEach(testTypeSnapshot => {
    testTypeSnapshot.forEach(testRecordSnapshot => {
      const timestamp = testRecordSnapshot.child('timestamp').val();
      counts.testsTotal++;
      if (timestamp >= oneWeekAgo) {
        counts.testsWeek++;
      }
    });
  });
}

// Funkcja do agregacji danych dla każdej kategorii (transkrypcje, analizy itp.)
async function aggregateData(db, path, oneWeekAgo, counts, keyPrefix) {
  const snapshot = await db.ref(path).once('value');
  snapshot.forEach(childSnapshot => {
    const date = childSnapshot.child('date').val();
    counts[keyPrefix + 'Total']++;
    if (date >= oneWeekAgo) {
      counts[keyPrefix + 'Week']++;
    }
  });
}

async function checkAndCreateAssistant(uid) {
  const db = admin.database();
  const userRef = db.ref(`secdata/${uid}/personal`);
  const snapshot = await userRef.once('value');
  

  if (!snapshot.hasChild('assistantOpenAiFn')) {
    const assistantName = uid;
    const assistantNameCv = uid + "Cv";
    const assistantNameNeuro = uid + "Neuro";

    
    try {

      const createVectorStore = await openai.beta.vectorStores.create({
        name: `${assistantName}`
      });
      const vectorStoreIdCreate = createVectorStore.id;
      console.log("vectorStoreIdCreate: " + vectorStoreIdCreate);

      const createVectorStoreCV = await openai.beta.vectorStores.create({
        name: `${assistantNameCv}`
      });
      const vectorStoreIdCreateCv = createVectorStoreCV.id;

      const createVectorStoreNeuro = await openai.beta.vectorStores.create({
        name: `${assistantNameNeuro}`
      });
      const vectorStoreIdCreateNeuro = createVectorStoreNeuro.id;

const assistantInstr = `Analyze attached transcripts, match CVs to job listings, support the creation of better application documents, and synthesize psychological test results, identifying relationships between various document types for a single user.

The tasks involve:

- **Transcripts**: Analyze meeting, project, or other recording transcripts.
- **Recruitment Documents**: Evaluate and match CVs to job listings, and assist in building improved application documents.
- **Psychological Tests**: Collect and analyze results from psychological assessments.
- **Document Interrelationships**: Create links and dependencies between different types of documents related to the user.

# Steps

1. **Transcription Analysis**:
   - Review and summarize key points from meeting and project transcripts.
   - Identify action items and potential follow-up requirements.

2. **CV and Job Matching**:
   - Compare CV details against job listings.
   - Provide suggestions for enhancements to make the CV more appealing for specific roles.

3. **Psychological Test Analysis**:
   - Analyze psychological test results.
   - Provide insights or recommendations based on the analysis.

4. **Interrelationship Mapping**:
   - Identify and define potential relationships between transcripts, recruitment documents, and test results.
   - Document how these interactions could assist the user in achieving their objectives.

# Output Format

Provide results in a structured paragraph format with clear headings for each task section: Transcripts Analysis, CV and Job Matching, Psychological Test Analysis, and Document Interrelationships.

# Examples

### Example 1
**Input**:
- Transcript of a project meeting.
- User's CV and a job listing.
- Results of a psychological test.

**Output**:
- **Transcripts Analysis**: "The project meeting emphasized the need for a new project timeline and assigned tasks to key members. Follow-up required on task allocation."
- **CV and Job Matching**: "The CV aligns well with the job listing requirements, minor enhancements suggested in the skills section to emphasize leadership experience."
- **Psychological Test Analysis**: "Test results indicate strong analytical skills and suggest focusing on roles demanding problem-solving abilities."
- **Document Interrelationships**: "Skills highlighted in psychological test results match those needed in the suggested job listing. Further training recommended based on meeting discussion."

# Notes

- Ensure confidentiality and data privacy for the user's documents.
- Provide actionable insights that can help the user optimize their job application process and personal development.
- Consider cultural and industry-specific contexts when offering CV enhancement suggestions.`;

      const createAssistantCurlCommandFn = await openai.beta.assistants.create({
              instructions: assistantInstr,
              name: `${assistantName}-focusNotes`,
              tools: [{ type: "file_search" }],
              tool_resources: {
                file_search: {
                  vector_store_ids: [vectorStoreIdCreate]
                }
              },
              model: "gpt-4o-mini"
            });

      const createAssistantCurlCommandCv = await openai.beta.assistants.create({
              instructions: assistantInstr,
              name: `${assistantName}-cvBuddy`,
              tools: [{ type: "file_search" }],
              tool_resources: {
                file_search: {
                  vector_store_ids: [vectorStoreIdCreateCv]
                }
              },
              model: "gpt-4o-mini"
            });
      
      const createAssistantCurlCommandNeuro = await openai.beta.assistants.create({
              instructions: assistantInstr,
              name: `${assistantName}-Neuro`,
              tools: [{ type: "file_search" }],
              tool_resources: {
                file_search: {
                  vector_store_ids: [vectorStoreIdCreateNeuro]
                }
              },
              model: "gpt-4o-mini"
            });
      

      
      const messageThreadAddCurlFn = await openai.beta.threads.create();
      const messageThreadAddCurlCv = await openai.beta.threads.create();
      const messageThreadAddCurlNeuro = await openai.beta.threads.create();
      

      const assistantIdFn = createAssistantCurlCommandFn.id;
      const assistantIdCv = createAssistantCurlCommandCv.id;
      const assistantIdNeuro = createAssistantCurlCommandNeuro.id;
      const messageThreadAddFn = messageThreadAddCurlFn.id;
      const messageThreadAddCv = messageThreadAddCurlCv.id;
      const messageThreadAddNeuro = messageThreadAddCurlNeuro.id;

      const vector_store_ids = vectorStoreIdCreate;
      const vector_store_ids_cv = vectorStoreIdCreateCv;
      const vector_store_ids_neuro = vectorStoreIdCreateNeuro;
      

      await userRef.update({
        assistantOpenAiFn: assistantIdFn,
        assistantOpenAiCv: assistantIdCv,
        assistantOpenAiNeuro: assistantIdNeuro,
        threads: {cvBuddy: messageThreadAddCv, fn:messageThreadAddFn, neuro: messageThreadAddNeuro },
        vector_store_ids: vector_store_ids,
        vector_store_ids_cv: vector_store_ids_cv,
        vector_store_ids_neuro: vector_store_ids_neuro
      });

      return { assistantIdFn: assistantIdFn, assistantIdCv: assistantIdCv, assistantIdNeuro: assistantIdNeuro, vector_store_ids: vector_store_ids, vector_store_ids_cv: vector_store_ids_cv, vector_store_ids_neuro: vector_store_ids_neuro, messageThreadAddFn: messageThreadAddFn, messageThreadAddCv: messageThreadAddCv, messageThreadAddNeuro: messageThreadAddNeuro };
    } catch (error) {
      console.error('Error creating OpenAI Assistant:', error);
      throw new functions.https.HttpsError('internal', 'Error creating OpenAI Assistant');
    }
  } 

  return { message: 'Assistant already exists' };
}

function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function stripHtmlTags(str) {
return str.replace(/<\/?[^>]+(>|$)/g, ""); // Usuwa wszystkie znaczniki HTML
}

function truncateString(str, maxLength) {
if (str.length > maxLength) {
    return str.substring(0, maxLength) + '...';
}
return str;
}

// Funkcja sprawdzająca, czy plik to poprawny plik PDF
async function checkValidPDF(filePath) {
const fileBuffer = await fs.readFile(filePath);
return fileBuffer.toString('utf-8', 0, 4) === '%PDF';
}

// Funkcja do przetwarzania zawartości pliku VTT na tablicę obiektów JSON
async function parseVTTToJSON(content) {
try {
  // Konwertuj bufor na łańcuch znaków (String)
  const contentString = content.toString('utf-8');
  // Usuń wszystkie wystąpienia znaku \r
  const sanitizedContent = contentString.replace(/\r/g, '');
  console.log("content to string: " + sanitizedContent);
  // Podziel zawartość na linie
  const lines = sanitizedContent.trim().split('\n');

  // Usuń pierwszą linię, która zazwyczaj zawiera informacje o formacie (WEBVTT)
  lines.shift();

  const captions = [];
  let caption = {};

  // Przetwórz każdą linię, aby utworzyć tablicę obiektów JSON
  for (const line of lines) {
    if (line.includes('-->')) {
      // Jeśli linia zawiera znacznik czasu, zapisz go w obiekcie caption
      const [startTime, endTime] = line.split(' --> ');
      //caption.startTime = startTime;
      caption.end = timeToSeconds(endTime);
    } else if (line.trim() === '') {
      // Jeśli linia jest pusta, dodaj obiekt caption do tablicy captions i zresetuj caption
      if (Object.keys(caption).length > 0) {
        captions.push(caption);
      }
      caption = {};
    } else {
      // W przeciwnym razie dodaj tekst napisu do obiektu caption
      const matchName = line.match(/<v\s+([^>]+)>([^<]+)/);
      if (matchName) {
        const name = matchName[1].trim();
        const text = matchName[2].trim();
        caption.text = `${name}: ${text}`;
      } else {
        caption.text = line.trim();
      }
    }
  }

  // Jeśli jest jakiś niezapisany caption na końcu, dodaj go do tablicy
  if (Object.keys(caption).length > 0) {
    captions.push(caption);
  }

  // Zwróć tablicę obiektów JSON
  return captions;
} catch (error) {
  console.error('Błąd podczas przetwarzania pliku VTT:', error);
  throw new Error('Błąd podczas przetwarzania pliku VTT.');
}
}

function timeToSeconds(timeString) {
const [hours, minutes, secondsMillis] = timeString.split(':');
const [seconds, milliseconds] = secondsMillis.split('.');

const totalSeconds =
  parseInt(hours, 10) * 3600 +
  parseInt(minutes, 10) * 60 +
  parseInt(seconds, 10) +
  parseFloat('0.' + milliseconds);

return totalSeconds;
}

function toHHMMSS(secs) {
let sec_num = parseInt(secs, 10);
let hours = Math.floor(sec_num / 3600);
let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
let seconds = sec_num - (hours * 3600) - (minutes * 60);

if (hours < 10) { hours = "0" + hours; }
if (minutes < 10) { minutes = "0" + minutes; }
seconds = seconds.toFixed(2);
if (seconds < 10) { seconds = "0" + seconds; }
return 'Długość nagrania: ' + hours + 'h:' + minutes + 'm:' + seconds + 's';
}

function sendDataToEndpoint(email, content, category, part1, part2, part3, title) {
const dataToSend = {
  category: category,
  summary: content,
  to: email,
  part1: part1,
  part2: part2,
  part3: part3,
  title: title,
};

fetch('https://hook.eu1.make.com/orzxol449aa4x9unyr8ekhv6r0595o7o', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(dataToSend)
})
 // .then(response => response.json())
 // .then(data => {
 //   console.log('Dane zostały pomyślnie wysłane:', data);
 // })
 // .catch((error) => {
 //   console.error('Błąd podczas wysyłania danych:', error);
 // });
}

// Funkcja konwertująca EPUB na TXT
async function convertEpubToText(epubPath) {
  return new Promise((resolve, reject) => {
    const epub = new Epub(epubPath);

    let text = '';

    epub.on('end', () => {
      // Pobierz wszystkie rozdziały
      const chapters = epub.flow;

      const promises = chapters.map(chapter => {
        return new Promise((res, rej) => {
          epub.getChapter(chapter.id, (err, data) => {
            if (err) {
              rej(err);
            } else {
              // Usuń tagi HTML
              const chapterText = data.replace(/<\/?[^>]+(>|$)/g, '');
              text += chapterText + '\n';
              res();
            }
          });
        });
      });

      Promise.all(promises)
        .then(() => resolve(text))
        .catch(err => reject(err));
    });

    epub.parse();
  });
}

// Funkcja pomocnicza do sprawdzania poprawności PDF (przykładowa implementacja)
async function checkValidPDFbrak(filePath) {
  // Implementacja sprawdzania pliku PDF
  // Możesz użyć bibliotek takich jak pdf-parse lub pdfjs
  return true; // Zwróć true, jeśli PDF jest poprawny, w przeciwnym razie false
}
