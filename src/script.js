document.addEventListener('DOMContentLoaded', () => {
    const inputCode = document.getElementById('inputCode');
    const outputCode = document.getElementById('outputCode');
    const obfuscateBtn = document.getElementById('obfuscateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const copyFeedback = document.getElementById('copyFeedback');

    // Helper to generate a random variable name
    function generateRandomVarName(length = 8) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // CORE OBFUSCATION LOGIC (Basic Minification, Junk Code, and String Concatenation)
    function basicObfuscate(code) {
        // 1. Minify/Strip Comments
        let minified = code.replace(/--.*$/gm, ''); // Remove single-line comments
        minified = minified.replace(/\s+/g, ' ');   // Collapse multiple spaces
        minified = minified.trim();

        // 2. Junk Code Insertion 
        const dummyFuncName = generateRandomVarName(10);
        const dummyVarName = generateRandomVarName(5);
        const junkCode = `\nlocal function ${dummyFuncName}(a, b) local ${dummyVarName} = a + b * 1e-9; if ${dummyVarName} > 1e12 then return 0 end; end; ${dummyFuncName}(os.clock(), math.pi);\n`;

        // 3. Simple String Hiding (Converts "string" to 's'.. 't'.. 'r'.. 'i'.. 'n'.. 'g')
        let obfuscated = minified.replace(/"([^"]*)"/g, (match, p1) => {
            if (p1.length === 0) return '""';
            const chars = Array.from(p1).map(char => `'${char}'`).join('..');
            return chars;
        });

        return junkCode + obfuscated + junkCode;
    }

    // --- Event Listeners ---

    obfuscateBtn.addEventListener('click', () => {
        const originalCode = inputCode.value;
        
        if (originalCode.trim() === '') {
            outputCode.value = 'Please paste some Luau code to obfuscate.';
            return;
        }

        try {
            const obfuscatedResult = basicObfuscate(originalCode);
            outputCode.value = obfuscatedResult;
        } catch (error) {
            outputCode.value = `Error during obfuscation: ${error.message}`;
            console.error(error);
        }
    });

    copyBtn.addEventListener('click', () => {
        if (outputCode.value.trim() === '') {
            return;
        }
        
        // Use modern clipboard API
        navigator.clipboard.writeText(outputCode.value).then(() => {
            // Show feedback
            copyFeedback.style.opacity = '1';
            copyBtn.style.opacity = '0';
            
            // Hide feedback after a delay
            setTimeout(() => {
                copyFeedback.style.opacity = '0';
                copyBtn.style.opacity = '1';
            }, 1500); 
            
        }).catch(err => {
            console.error('Could not copy text: ', err);
            alert('Failed to copy code. Your browser may not support clipboard API.');
        });
    });
});
