require('dotenv').config()

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Your task is to summerize the note for student who wants to order them but not have time to do.\nCan you summerize everything clearly and understandable with the suggestion?\nWe need you to wrap things up from these notes.\nThe context has date, content that you need to summarize, tag and priority that will be define in the context.\n\nwe want you to : \n- Respones to only html pattern to be working for putting in nodemailer's form (no additional messages before and after the answer)\n- Combine the note that have the same date to the same line\n- Summary the content understandable, easy to read and related to the tag for less than 100 words\n- If there are duplicated tags but in the same date, summarize all content in the same section\n- Separate each tag and the content about tag.\n- If there's already has the content that has been summarize in the previous section, do not add them to other section.\n- The suggestion will be at the end of the summary.\n- Suggestion needs to be one line, The Suggestion has to be 5.\n- Order every section by date.\n\nfor the pattern we want :\n\n<h2>priority : yes </h2>\n<p>(date1)</p>\n<ul> \n\t<li>(tag1) : (summary)</li>\n\t<li>(tag2) : (summary)</li>\n</ul>\n<p>(date2)</p>\n<ul> \n\t<li>(tag1) : (summary)</li>\n\t<li>(tag2) : (summary)</li>\n</ul>\n\n<h2>priority : no </h2>\n<p>(date1)</p>\n<ul> \n\t<li>(tag1) : (summary)</li>\n\t<li>(tag2) : (summary)</li>\n</ul>\n\n(add every tag and note in the context till ran out of tag)\n\n<h2>Suggestion</h2>\n    <li>(suggestion)</li>\n    <li>(suggestion)</li>\n",
  });
  
  const generationConfig = {
    temperature: 0,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  const note = "วันที่ 14/02/2024\ntag: เรียน\npriority: yes\ncontent: วันนี้เป็นวันที่ฉันรู้สึกเครียดมาก เพราะอาจารย์ให้ทำการบ้านเกี่ยวกับการสร้างฐานข้อมูลและการเขียนคำสั่ง SQL ฉันใช้เวลาหลายชั่วโมงในการค้นคว้าและทดลองทำ แต่ผลลัพธ์กลับไม่เป็นอย่างที่หวัง มันทำให้ฉันรู้สึกหมดแรงและสงสัยว่าตัวเองจะสามารถผ่านวิชานี้ไปได้หรือไม่\n\nวันที่ 15/02/2024\ntag: เรียน\npriority: yes\ncontent: วันนี้เป็นวันที่ฉันต้องไปพบกับอาจารย์เพื่อขอคำปรึกษาเกี่ยวกับการบ้านที่ได้รับ อาจารย์ได้อธิบายเพิ่มเติมและให้คำแนะนำที่เป็นประโยชน์มาก ฉันรู้สึกว่าตัวเองเข้าใจเนื้อหามากขึ้น แม้ว่าจะยังมีบางส่วนที่ยังคงยากอยู่ แต่การได้พูดคุยกับอาจารย์ทำให้ฉันมีกำลังใจที่จะไม่ยอมแพ้\n\nวันที่ 16/02/2024\ntag: เรียน\npriority: yes\ncontent: วันนี้ฉันได้เข้าร่วมกลุ่มศึกษากับเพื่อนๆ เราได้แลกเปลี่ยนความรู้และช่วยกันแก้ปัญหาที่พบในการเรียน ฉันรู้สึกว่าการทำงานเป็นกลุ่มช่วยให้ฉันเข้าใจเนื้อหามากขึ้น และยังทำให้ความกังวลใจลดลงด้วย ฉันเริ่มรู้สึกมั่นใจมากขึ้นในการเรียนวิชานี้\n\nวันที่ 17/02/2024\ntag: เรียน\npriority: yes\ncontent: วันนี้เป็นวันที่ฉันรู้สึกดีกับตัวเองมากขึ้น ฉันสามารถทำการบ้านที่ได้รับมาเสร็จสมบูรณ์และผลลัพธ์ออกมาตรงตามที่อาจารย์ต้องการ การทำงานหนักและความพยายามไม่สูญเปล่า ทำให้ฉันรู้สึกภูมิใจและมีกำลังใจที่จะเรียนรู้ต่อไป"
  
  async function run() {
    const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: `this is the note \n${note}`},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());
  }
  
  run();