//import { useEffect, useState } from "react";
import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
//import { loadStoredData } from "../utils/storage";
import type { Template } from "../types";
import Stack from '@mui/material/Stack';

// function useStoredTemplates() {
//   const [templates, setTemplates] = useState<Template[]>([]);

//   useEffect(() => {
//     (async () => {
//       const data = await loadStoredData();
//       setTemplates(data.templates);
//     })();
//   }, []);

//   return templates;
// }

export default function TemplateDropdown() {
  const [text, setText] = useState("");
  //const templates = useStoredTemplates();
  
  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        freeSolo
        options={templates.map((option) => option.name)}
        inputValue={text}
        onInputChange={(_, value) => { setText(value); }}
        renderInput={(params) => (
            <TextField
              {...params}
              placeholder="テンプレートを選択..."
              size="small"
            />
          )}
      />
    </Stack>
  );
}

const templates: Template[] = [
  { id: 1, name: "summary", content: "#以下の文章を３つの要素にまとめて要約してください \n\n " },
  { id: 2, name: "explain", content: "#以下の文章をわかりやすく説明してください \n\n " },
  { id: 3, name: "word-check", content: "#この語は正しいでしょうか？ その定義を示し、さらにこの文脈で適切か（または適切でないか）を説明してください。 \n\n " },
];