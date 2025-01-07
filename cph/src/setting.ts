export const settings = {
    python: {
        run: "python3 $fileName"
    },
    cpp: {
        compile: "g++ -std=c++17 -o $fileNameWithoutExt $fileName",
        run: "./$fileNameWithoutExt"
    }
};
