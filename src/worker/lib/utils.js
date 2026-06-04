/**
 * 通用工具函数
 */
export function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
}

export function getFileIcon(fileName) {
    const ext = (fileName || '').split('.').pop().toLowerCase();
    const map = {
        mp4: '🎬', mov: '🎬', avi: '🎬', mkv: '🎬', webm: '🎬',
        mp3: '🎵', wav: '🎵', flac: '🎵', aac: '🎵', ogg: '🎵',
        jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️', svg: '🖼️', bmp: '🖼️',
        pdf: '📕',
        js: '📝', ts: '📝', jsx: '📝', tsx: '📝', py: '📝', java: '📝', cpp: '📝', c: '📝', go: '📝', rs: '📝',
        md: '📑', markdown: '📑',
        txt: '📄', log: '📄', csv: '📄',
        zip: '📦', rar: '📦', '7z': '📦', tar: '📦', gz: '📦',
    };
    return map[ext] || '📄';
}
