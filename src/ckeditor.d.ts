// frontend/src/ckeditor.d.ts
declare module '@ckeditor/ckeditor5-react' {
    import React from 'react';
    const CKEditor: React.FC<any>;
    export { CKEditor };
}

declare module '@ckeditor/ckeditor5-build-classic' {
    const ClassicEditor: any;
    export = ClassicEditor;
}