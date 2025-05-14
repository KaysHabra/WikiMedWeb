import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  constructor() { }

  cutString(text, startChar, includeStartChar, endChar, includeEndChar) {
    let startIndex = 0;
    let endIndex = text.length;
  
    if (startChar !== undefined && startChar !== null && startChar !== "") {
      const foundStartIndex = text.indexOf(startChar);
      if (foundStartIndex !== -1) {
        startIndex = includeStartChar ? foundStartIndex : foundStartIndex + startChar.length;
      } else {
        console.warn(`Start character "${startChar}" not found in the text.`);
        return "";
      }
    }
  
    if (endChar !== undefined && endChar !== null && endChar !== "") {
      const foundEndIndex = text.indexOf(endChar, startIndex);
      if (foundEndIndex !== -1) {
        endIndex = includeEndChar ? foundEndIndex + endChar.length : foundEndIndex;
      } else {
        console.warn(`End character "${endChar}" not found in the text after the start character.`);
        endIndex = text.length;
      }
    }
  
    return text.substring(startIndex, endIndex);
  }

  removeSubstring(originalText, substringToRemove) {
    // Use the replace() method with a regular expression to replace all occurrences
    // of the substring with an empty string.
    // The regular expression is created with the 'g' flag for global search.
    const newText = originalText.toString().replace(new RegExp(substringToRemove.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
    return newText;
  }
}
