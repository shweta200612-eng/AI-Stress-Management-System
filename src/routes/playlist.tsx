import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { type Mood } from "@/lib/wellness-store";
import { Music2, Sparkles, Clock } from "lucide-react";

const searchSchema = z.object({ mood: z.string().optional() });

export const Route = createFileRoute("/playlist")({
  head: () => ({ meta: [{ title: "Playlist — Bloom" }] }),
  validateSearch: searchSchema,
  component: PlaylistPage,
});

type Track = { title: string; artist: string; ytId: string };

// 20 Bollywood tracks per mood (curated)
const LIBRARY: Record<Mood, Track[]> = {
  calm: [
    { title: " KAR HAR MAIDAAN FATEH", artist: "Rajkumar Hirani", ytId: "9iIX4PBplAY" },
    { title: " Aarambh hai Prachand", artist: "Piyush Mishra", ytId: "WgfBVGGGG-U" },
    { title: "Bandeya Rey Bandeya", artist: "Arijit Singh", ytId: "Wj8C_bpnkTY" },
    { title: "Shaabaashiyaan", artist: "Shilpa Rao, Anand Bhaskar & Abhijeet Srivastava", ytId: "Q3JMD4oaXlI" },
    { title: "Ziddi Dil", artist: "Vishal Dadlani", ytId: "puKD3nkB1h4" },
    { title: "Ek Zindagi Meri", artist: "Tanishkaa Sanghvi, Sachin - Jigar", ytId: "mOEL8Q-2bSo" },
    { title: "Sultan ", artist: "Sukhwinder Singh, Shadab Faridi", ytId: "abiL84EAWSY" },
    { title: "Zinda", artist: "Siddharth Mahadevan", ytId: "TBP5kFOsqO8" },
    { title: "Sapne Re", artist: " Amit Trivedi ", ytId: "0Rm2cajspwY" },
    { title: "Parinda", artist: " Amaal Mallik", ytId: "1JPlmLKsrB4" },
    { title: "Manzar Hai Yeh Naya ", artist: "Shantanu Sudame & Shashwat Sachdev", ytId: "x5fYTPvrz4g" },
    { title: "Jeete Hain Chal", artist: "KAVITA SETH", ytId: "GZIh0bhuFtg" },
    { title: "Love You Zindagi", artist: " Amit Trivedi", ytId: "bw7bVpI5VcM" },
    { title: "Jiya Re ", artist: " A R Rahman", ytId: "smn3mDBOUy4" },
    { title: "Kudi Nu Nachne De", artist: "Vishal Dadlani, Sachin- Jigar", ytId: "oSpMspvMkSQ" },
    { title: "Dhaakad",artist: "Pritam", ytId: "0zFoHrvbRu4" },
    { title: "Dangal Dangal", artist: "Daler Mehndi", ytId: "GLK7flBXqsk" },
    { title: "Khol De Par", artist: "Arijit Singh", ytId: "u871WK7kem8" },
    { title: "Chak De India", artist: "Sukhwinder Singh", ytId: "bnqLzCsffwY" },
    { title: "Lakshya", artist: "Shankar Mahadevan", ytId: "sSsw7QPrUk0" },
  ],
  happy: [
    { title: "Gallan Goodiyaan", artist: "Dil Dhadakne Do", ytId: "mAZNK5OUaC8" },
    { title: "Balam Pichkari", artist: "YJHD", ytId: "0WtRNGubWGA" },
    { title: "Badtameez Dil", artist: "YJHD", ytId: "II2EO3Nw4m0" },
    { title: "London Thumakda", artist: "Queen", ytId: "udra3Mfw2oo" },
    { title: "Senorita", artist: "ZNMD", ytId: "tcYodQoapMg" },
    { title: "Nashe Si Chadh Gayi", artist: "Befikre", ytId: "HgzGwKwLmgM" },
    { title: "Tareefan", artist: "Veere Di Wedding", ytId: "lAQU0NbZ1Bk" },
    { title: "The Disco Song", artist: "SOTY", ytId: "Eb7d40_BJEU" },
    { title: "Kala Chashma", artist: "Baar Baar Dekho", ytId: "k4yXQkG2s1E" },
    { title: "Cutiepie", artist: "ADHM", ytId: "EaqIE6lwAOM" },
    { title: "Saturday Saturday", artist: "HSKD", ytId: "wIRDHFqMzfg" },
    { title: "Ainvayi Ainvayi", artist: "Band Baaja Baaraat", ytId: "I8QhRgX1QbY" },
    { title: "Sweetheart", artist: "Kedarnath", ytId: "B-mlPaSEHzM" },
    { title: "Tamma Tamma Again", artist: "BKD", ytId: "EEX_XM6SxmY" },
    { title: "Aankh Marey", artist: "Simmba", ytId: "_5_QJOew6FY" },
    { title: "First Class", artist: "Kalank", ytId: "JFcgOboQZ08" },
    { title: "Ghagra", artist: "YJHD", ytId: "caoGNx1LF2Q" },
    { title: "Tune Maari Entriyaan", artist: "Gunday", ytId: "VBJ7dKzN6tQ" },
    { title: "Subha Hone Na De", artist: "Desi Boyz", ytId: "B19HJK0NoEs" },
    { title: "Galla Goodiyaan Reprise", artist: "Various", ytId: "qFsHYIfu9Bo" },
  ],
  stressed: [
    { title: "Kun Faya Kun", artist: "A.R. Rahman", ytId: "T94PHkuydcw" },
    { title: "Kabira (slow)", artist: "Arijit Singh", ytId: "jHNNMj5bNQw" },
    { title: "Mitwa", artist: "Shafqat Amanat", ytId: "GhTYFW3uxOw" },
    { title: "Tum Hi Ho", artist: "Arijit Singh", ytId: "IJq0yX9HX2k" },
    { title: "Phir Le Aya Dil", artist: "Arijit Singh", ytId: "lokKnIcl0Cw" },
    { title: "Tera Ban Jaunga", artist: "Akhil Sachdeva", ytId: "SBjQ9tuuTJQ" },
    { title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", ytId: "6FURuLYrR_Q" },
    { title: "Channa Mereya", artist: "Arijit Singh", ytId: "bzSTpdcs-EI" },
    { title: "Tujhe Bhula Diya", artist: "Mohit Chauhan", ytId: "ZG3ddRoCRBM" },
    { title: "Phir Mohabbat", artist: "Arijit Singh", ytId: "ueE9ts9_F00" },
    { title: "Tose Naina Lage", artist: "Shafqat Amanat", ytId: "DUiTjyNo5sw" },
    { title: "Bhula Dena", artist: "Mustafa Zahid", ytId: "iGwjcgi-Ess" },
    { title: "Tere Bina", artist: "A.R. Rahman", ytId: "TanK-yA6X1A" },
    { title: "Khairiyat", artist: "Arijit Singh", ytId: "hoNb6HuNmU0" },
    { title: "Ranjha", artist: "Jasleen Royal", ytId: "RhBgkqLZqfQ" },
    { title: "Ve Maahi", artist: "Arijit Singh", ytId: "uXFY8jvVliQ" },
    { title: "Lag Ja Gale", artist: "Lata Mangeshkar", ytId: "Q_lq8MEzkAk" },
    { title: "Ajeeb Dastaan Hai Ye", artist: "Lata Mangeshkar", ytId: "5w-G7VLFqYY" },
    { title: "Kahin To", artist: "Rashid Ali", ytId: "GHQYpaoTNYY" },
    { title: "Roobaroo", artist: "Naresh Iyer", ytId: "94yC1zEsZBM" },
  ],
  sad: [
    { title: "Channa Mereya", artist: "Arijit Singh", ytId: "bzSTpdcs-EI" },
    { title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", ytId: "6FURuLYrR_Q" },
    { title: "Agar Tum Saath Ho", artist: "Arijit & Alka", ytId: "xRb_9SP-RqM" },
    { title: "Tujhe Bhula Diya", artist: "Mohit Chauhan", ytId: "ZG3ddRoCRBM" },
    { title: "Tum Hi Ho", artist: "Arijit Singh", ytId: "IJq0yX9HX2k" },
    { title: "Phir Mohabbat", artist: "Arijit Singh", ytId: "ueE9ts9_F00" },
    { title: "Khairiyat", artist: "Arijit Singh", ytId: "hoNb6HuNmU0" },
    { title: "Tera Ban Jaunga", artist: "Akhil Sachdeva", ytId: "SBjQ9tuuTJQ" },
    { title: "Hamari Adhuri Kahani", artist: "Arijit Singh", ytId: "0EVRoLN4rN8" },
    { title: "Tere Bina Zindagi Se", artist: "Lata & Kishore", ytId: "L1u-_o4XHpA" },
    { title: "Lag Ja Gale", artist: "Lata Mangeshkar", ytId: "Q_lq8MEzkAk" },
    { title: "Phir Le Aya Dil", artist: "Arijit Singh", ytId: "lokKnIcl0Cw" },
    { title: "Jeene Bhi De", artist: "Yasser Desai", ytId: "wuV0LB-XBxs" },
    { title: "Humdard", artist: "Arijit Singh", ytId: "QFs3PIZb3js" },
    { title: "Muskurane", artist: "Arijit Singh", ytId: "qFsHYIfu9Bo" },
    { title: "Lo Maan Liya", artist: "Arijit Singh", ytId: "7iAbStOOR8c" },
    { title: "Mere Bina", artist: "Nikhil D'Souza", ytId: "TbXrM-aRrEM" },
    { title: "Bewafa", artist: "Imran Khan", ytId: "fJ4snmtSnK0" },
    { title: "Tujhe Sochta Hoon", artist: "K.K.", ytId: "QZpRJgrUOXk" },
    { title: "Bhula Dena", artist: "Mustafa Zahid", ytId: "iGwjcgi-Ess" },
  ],
  anxious: [
    { title: "Khwaja Mere Khwaja", artist: "A.R. Rahman", ytId: "Z4EuoEM8Cgo" },
    { title: "Kun Faya Kun", artist: "A.R. Rahman", ytId: "T94PHkuydcw" },
    { title: "Mann Re", artist: "Swanand Kirkire", ytId: "Q-RrJiBO8YA" },
    { title: "Iktara", artist: "Kavita Seth", ytId: "lLVH1KMhWxo" },
    { title: "Phir Se Ud Chala", artist: "Mohit Chauhan", ytId: "NCu8MykvqsE" },
    { title: "Pal Pal Hai Bhaari", artist: "Roop Kumar", ytId: "vSk5tdSxV4Y" },
    { title: "Tera Mujhse Hai Pehle", artist: "Kishore Kumar", ytId: "vGzwbR-zZ_o" },
    { title: "Naina", artist: "Arijit Singh", ytId: "k1B8z08SVL4" },
    { title: "Tum Ho", artist: "Mohit Chauhan", ytId: "5dRDGz5-0J0" },
    { title: "O Re Piya", artist: "Rahat Fateh Ali", ytId: "wYTaFc8s1lA" },
    { title: "Maa", artist: "Shankar Mahadevan", ytId: "5xRZuPv-S20" },
    { title: "Luka Chuppi", artist: "Lata & Rahman", ytId: "8C2g7Yi0fmA" },
    { title: "Phir Bhi Yeh Zindagi", artist: "Aditi Singh", ytId: "8gZ_LurSyAY" },
    { title: "Yeh Jo Des Hai Tera", artist: "A.R. Rahman", ytId: "8DGoMcaW1AY" },
    { title: "Saibo", artist: "Shreya & Tochi", ytId: "TyEEZ2RP_x4" },
    { title: "Tu Hi Re", artist: "Hariharan", ytId: "Z3OAYbI9LdU" },
    { title: "Geet", artist: "Mohit Chauhan", ytId: "PHrNCgRy-tk" },
    { title: "Tujh Mein Rab Dikhta Hai", artist: "Roop Kumar", ytId: "GBb5tWXFiSE" },
    { title: "Tere Sang Yaara", artist: "Atif Aslam", ytId: "KsM6oWdQ2EQ" },
    { title: "Tum Tak", artist: "Javed Ali", ytId: "k0ROn5gKZk0" },
  ],
  tired: [
    { title: "Nuvole Bianche (Hindi cover)", artist: "Various", ytId: "kcihcYEOeic" },
    { title: "Tum Ho", artist: "Mohit Chauhan", ytId: "5dRDGz5-0J0" },
    { title: "Phir Se Ud Chala", artist: "Mohit Chauhan", ytId: "NCu8MykvqsE" },
    { title: "Iktara", artist: "Kavita Seth", ytId: "lLVH1KMhWxo" },
    { title: "Kun Faya Kun", artist: "A.R. Rahman", ytId: "T94PHkuydcw" },
    { title: "Saibo", artist: "Shreya & Tochi", ytId: "TyEEZ2RP_x4" },
    { title: "Pal", artist: "Arijit Singh", ytId: "wn7v5KFFW40" },
    { title: "Raabta", artist: "Arijit Singh", ytId: "zlt38OOqwDc" },
    { title: "Mere Naam Tu", artist: "Abhay Jodhpurkar", ytId: "rwwgnFvDx80" },
    { title: "Tere Liye", artist: "Roop Kumar", ytId: "MEHCRDdgrjg" },
    { title: "Khwaja Mere Khwaja", artist: "A.R. Rahman", ytId: "Z4EuoEM8Cgo" },
    { title: "Lag Ja Gale", artist: "Lata Mangeshkar", ytId: "Q_lq8MEzkAk" },
    { title: "Sajna", artist: "Badshah & Lisa", ytId: "fHQqHbHIBSk" },
    { title: "Tujhe Kitna Chahne Lage", artist: "Arijit Singh", ytId: "AEIVhBS6baE" },
    { title: "Janam Janam", artist: "Arijit Singh", ytId: "WTJSt4wP2ME" },
    { title: "Tum Hi Ho", artist: "Arijit Singh", ytId: "IJq0yX9HX2k" },
    { title: "Kabira", artist: "Tochi Raina", ytId: "jHNNMj5bNQw" },
    { title: "Hawayein", artist: "Arijit Singh", ytId: "cYOB941gyXI" },
    { title: "Tum Mile", artist: "Neeraj Shridhar", ytId: "IUd5DwHa2qE" },
    { title: "Tose Naina", artist: "Shafqat Amanat", ytId: "DUiTjyNo5sw" },
  ],
  energized: [
    { title: "Malhari", artist: "Vishal Dadlani", ytId: "l_MyUGq7pgs" },
    { title: "Zinda", artist: "Siddharth Mahadevan", ytId: "OZ7sROj1MLA" },
    { title: "Kar Har Maidan Fateh", artist: "Sukhwinder Singh", ytId: "jzD_yyEcp0M" },
    { title: "Sultan (title)", artist: "Sukhwinder", ytId: "FdHJU-zHnIA" },
    { title: "Brothers Anthem", artist: "Vishal Dadlani", ytId: "Cs5Xj_ekUgY" },
    { title: "Apna Time Aayega", artist: "Ranveer Singh", ytId: "jFjEYBlcvE0" },
    { title: "Dhakad", artist: "Raftaar", ytId: "7d3FUlmsf2I" },
    { title: "Jee Karda", artist: "Daler Mehndi", ytId: "Wm5OqRX1eAY" },
    { title: "Ziddi Dil", artist: "Vishal Dadlani", ytId: "GqHcS2DSCRk" },
    { title: "Senorita", artist: "ZNMD", ytId: "tcYodQoapMg" },
    { title: "Dil Dhadakne Do (title)", artist: "Priyanka & Farhan", ytId: "9XfeMaBhsZw" },
    { title: "Tattad Tattad", artist: "Aditya Narayan", ytId: "BcdmldEr2vk" },
    { title: "Khalibali", artist: "Shivam Pathak", ytId: "ENGEY_Z5JtY" },
    { title: "Galti Se Mistake", artist: "Arijit & Jonita", ytId: "9aJsKW0DvBs" },
    { title: "Aaj Ki Raat", artist: "Sonu Nigam", ytId: "kV0DKj8ScdY" },
    { title: "Dhoom Machale", artist: "Sunidhi", ytId: "PgrhWi9X0v0" },
    { title: "Chak Lein De", artist: "K.K.", ytId: "S5L7gG41YBQ" },
    { title: "Mauja Hi Mauja", artist: "Mika Singh", ytId: "lTfV7t-EsTo" },
    { title: "Aankh Marey", artist: "Simmba", ytId: "_5_QJOew6FY" },
    { title: "Nashe Si Chadh Gayi", artist: "Befikre", ytId: "HgzGwKwLmgM" },
  ],
};

function timeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const h = new Date().getHours();
  if (h < 6) return "night";
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  if (h < 22) return "evening";
  return "night";
}

function PlaylistPage() {
  const search = useSearch({ from: "/playlist" });
  const mood = (search.mood as Mood) || "calm";
  const tod = useMemo(timeOfDay, []);

  const tracks = LIBRARY[mood] || LIBRARY.calm;
  const tagline = useMemo(() => {
    if (tod === "morning") return mood === "tired" ? "Soft wake-up Bollywood" : "A bright Bollywood start";
    if (tod === "afternoon") return "Mid-day reset";
    if (tod === "evening") return "Wind-down warmth — desi style";
    return "Late-night Bollywood softness";
  }, [mood, tod]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl">Your playlist</h1>
          <p className="text-muted-foreground mt-3 flex items-center justify-center gap-2 flex-wrap">
            <Clock className="w-4 h-4" /> {tod} · <Sparkles className="w-4 h-4 text-primary" /> {tagline} · 20 songs
          </p>
        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tracks.map((t, i) => (
           <div
  key={`${t.ytId}-${i}`}
  className="rounded-3xl bg-white border border-border p-3 shadow-soft"
>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                <iframe
                  width="100%" height="100%"
                  src={`https://www.youtube.com/embed/${t.ytId}`}
                  title={t.title}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="px-2 pt-3 pb-1 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-display text-base truncate">{t.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.artist}</div>
                </div>
                <Music2 className="w-4 h-4 text-primary shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}