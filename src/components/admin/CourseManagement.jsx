import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase/client';
import { Plus, Edit2, Trash2, Paperclip, X, Upload, FileText, FileSpreadsheet, File, Video, Link2, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

function FileIcon({ nombre, tipo, size = 16 }) {
    const ext = nombre?.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext) || tipo?.includes('pdf'))
        return <FileText size={size} className="text-red-400" />;
    if (['xls', 'xlsx', 'csv'].includes(ext) || tipo?.includes('sheet'))
        return <FileSpreadsheet size={size} className="text-green-400" />;
    if (['doc', 'docx'].includes(ext) || tipo?.includes('word'))
        return <FileText size={size} className="text-blue-400" />;
    if (['mp4', 'mov', 'avi'].includes(ext) || tipo?.includes('video'))
        return <Video size={size} className="text-purple-400" />;
    return <File size={size} className="text-slate-400" />;
}

function formatBytes(bytes) {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const EMPTY_FORM = {
    nombre: '', precio: '', categoria: 'Holístico',
    descripcion: '', imagen_url: '', video_url: '',
    duracion: '', nivel: 'Principiante', acceso: 'De por vida', certificado: 'SI',
    temario: [],
    archivos: [], activo: true
};

export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCourse, setEditingCourse] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [uploadQueue, setUploadQueue] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchCourses = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('cursos').select('*').order('fecha_creacion', { ascending: false });
        if (!error) setCourses(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchCourses(); }, []);

    const openModal = (course = null) => {
        if (course) {
            setEditingCourse(course);
            setFormData({
                nombre: course.nombre || '',
                precio: course.precio || '',
                categoria: course.categoria || 'Holístico',
                descripcion: course.descripcion || '',
                imagen_url: course.imagen_url || course.imagen || '',
                video_url: course.video_url || '',
                duracion: course.duracion || '',
                nivel: course.nivel || 'Principiante',
                acceso: course.acceso || 'De por vida',
                certificado: course.certificado || 'SI',
                temario: course.temario || [],
                archivos: course.archivos || [],
                activo: course.activo !== undefined ? course.activo : true
            });
            setIsAdding(false);
        } else {
            setEditingCourse(null);
            setFormData(EMPTY_FORM);
            setIsAdding(true);
        }
        setUploadQueue([]);
    };

    const closeModal = () => { setIsAdding(false); setEditingCourse(null); setUploadQueue([]); };

    // ── File selection ──
    const handleFilesSelected = (e) => {
        const files = Array.from(e.target.files);
        setUploadQueue(prev => [...prev, ...files.map(f => ({ file: f, progress: 0, status: 'pending', url: null }))]);
        e.target.value = '';
    };

    const removeFromQueue = (idx) => setUploadQueue(prev => prev.filter((_, i) => i !== idx));

    // ── Upload to Supabase Storage ──
    const uploadAll = async () => {
        if (!uploadQueue.some(i => i.status === 'pending')) return;
        setIsUploading(true);
        console.log('--- Iniciando proceso de subida ---');

        const courseId = editingCourse?.id || `temp_${Date.now()}`;
        const updater = (idx, patch) =>
            setUploadQueue(prev => prev.map((item, i) => i === idx ? { ...item, ...patch } : item));

        const newArchivos = [];
        try {
            for (let i = 0; i < uploadQueue.length; i++) {
                const item = uploadQueue[i];
                if (item.status !== 'pending') continue;

                console.log(`Subiendo archivo: ${item.file.name}...`);
                updater(i, { status: 'uploading' });

                const path = `courses/${courseId}/${Date.now()}_${item.file.name}`;

                try {
                    const { data, error } = await supabase.storage
                        .from('course-files')
                        .upload(path, item.file, {
                            upsert: true,
                            cacheControl: '3600'
                        });

                    if (error) {
                        console.error(`Error de Supabase al subir ${item.file.name}:`, error);
                        updater(i, { status: 'error' });
                        alert(`Error al subir ${item.file.name}: ${error.message}`);
                    } else if (data) {
                        console.log(`Subida exitosa: ${item.file.name}. Obteniendo URL pública...`);
                        const { data: urlData } = supabase.storage.from('course-files').getPublicUrl(data.path);

                        updater(i, { status: 'done', progress: 100, url: urlData.publicUrl });
                        newArchivos.push({
                            nombre: item.file.name,
                            url: urlData.publicUrl,
                            tipo: item.file.type,
                            tamaño: item.file.size,
                            fecha: new Date().toISOString()
                        });
                    }
                } catch (innerError) {
                    console.error(`Excepción interna subiendo ${item.file.name}:`, innerError);
                    updater(i, { status: 'error' });
                }
            }
        } catch (globalError) {
            console.error('Error global en el bucle de subida:', globalError);
            alert('Ocurrió un error inesperado durante la subida.');
        } finally {
            if (newArchivos.length > 0) {
                setFormData(prev => ({ ...prev, archivos: [...(prev.archivos || []), ...newArchivos] }));
            }
            setIsUploading(false);
            console.log('--- Proceso de subida finalizado ---');
        }
    };

    const removeArchivoGuardado = async (idx) => {
        const archivo = formData.archivos[idx];
        // Best-effort: try to delete from storage
        const path = archivo.url?.split('/course-files/')[1];
        if (path) await supabase.storage.from('course-files').remove([path]);
        setFormData(prev => ({ ...prev, archivos: prev.archivos.filter((_, i) => i !== idx) }));
    };

    // ── Save course ──
    const handleSave = async (e) => {
        e.preventDefault();
        console.log('--- Iniciando guardado de curso ---');
        console.log('Datos actuales en formData:', formData);

        if (uploadQueue.some(i => i.status === 'pending')) {
            alert('Tenés archivos sin subir. Hacé clic en "Subir" primero.');
            return;
        }

        // Mapeo explícito para evitar enviar campos extra que no existan en la DB
        const courseData = {
            nombre: formData.nombre,
            precio: Number(formData.precio),
            categoria: formData.categoria,
            descripcion: formData.descripcion,
            imagen_url: formData.imagen_url,
            video_url: formData.video_url,
            duracion: formData.duracion,
            nivel: formData.nivel,
            acceso: formData.acceso,
            certificado: formData.certificado,
            temario: formData.temario || [],
            archivos: formData.archivos || [],
            activo: formData.activo,
            fecha_actualizacion: new Date().toISOString()
        };

        console.log('Datos procesados para enviar a Supabase:', courseData);

        try {
            if (editingCourse) {
                console.log(`Actualizando curso ID: ${editingCourse.id}`);
                const { data, error } = await supabase
                    .from('cursos')
                    .update(courseData)
                    .eq('id', editingCourse.id)
                    .select(); // Pedimos el retorno para verificar

                if (error) {
                    console.error('Error de Supabase (Update):', error);
                    throw error;
                }
                console.log('Respuesta exitosa (Update):', data);
            } else {
                console.log('Insertando nuevo curso');
                const { data, error } = await supabase
                    .from('cursos')
                    .insert([{ ...courseData, fecha_creacion: new Date().toISOString() }])
                    .select();

                if (error) {
                    console.error('Error de Supabase (Insert):', error);
                    throw error;
                }
                console.log('Respuesta exitosa (Insert):', data);
            }

            closeModal();
            await fetchCourses();
            alert('Curso guardado correctamente');
        } catch (error) {
            console.error('Error capturado en handleSave:', error);
            alert('Error al guardar el curso: ' + (error.message || 'Error desconocido. Revisa la consola (F12)'));
        } finally {
            console.log('--- Fin del proceso de guardado ---');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este curso?')) return;
        await supabase.from('cursos').delete().eq('id', id);
        setCourses(c => c.filter(x => x.id !== id));
    };

    if (loading) return <div className="p-10 text-center text-slate-400">Cargando cursos...</div>;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <header>
                    <h1 className="text-3xl font-black text-slate-100 tracking-tighter">Gestión de Cursos</h1>
                    <p className="text-slate-400 font-medium italic">Edita, agrega o elimina cursos de tu catálogo.</p>
                </header>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95">
                    <Plus size={18} /> Nuevo Curso
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {courses.map(course => (
                    <div key={course.id} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6 hover:border-primary/30 transition-all">
                        <img src={course.imagen_url || course.imagen} alt={course.nombre} className="w-24 h-24 rounded-2xl object-cover ring-1 ring-white/10" />
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-black text-slate-100">{course.nombre}</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{course.categoria}</p>
                            <span className="text-xl font-black text-primary">${course.precio}</span>
                            {course.archivos?.length > 0 && (
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                    <Paperclip size={11} /> {course.archivos.length} archivo{course.archivos.length !== 1 ? 's' : ''} adjunto{course.archivos.length !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => openModal(course)} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-blue-400 border border-white/10 hover:border-blue-400/50 transition-all" title="Editar"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(course.id)} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-red-500 border border-white/10 hover:border-red-500/50 transition-all" title="Eliminar"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {(isAdding || editingCourse) && (
                <div className="fixed inset-0 bg-background-dark/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-slate-100">{isAdding ? 'Nuevo Curso' : 'Editar Curso'}</h2>
                            <button onClick={closeModal} className="text-slate-500 hover:text-slate-100"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSave} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Nombre del Curso</label>
                                <input required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Precio ($)</label>
                                    <input required type="number" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Categoría</label>
                                    <input required value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Descripción</label>
                                <textarea required value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold h-28" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Link Imagen</label>
                                <input required value={formData.imagen_url} onChange={e => setFormData({ ...formData, imagen_url: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-1"><Video size={12} /> Link Video</label>
                                <input placeholder="https://youtube.com/..." value={formData.video_url} onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold" />
                            </div>

                            {/* ── Detalles del curso ── */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Duración</label>
                                    <input placeholder="Ej: 14 Horas" value={formData.duracion} onChange={e => setFormData({ ...formData, duracion: e.target.value })}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Nivel</label>
                                    <input placeholder="Ej: Principiante" value={formData.nivel} onChange={e => setFormData({ ...formData, nivel: e.target.value })}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Acceso</label>
                                    <input placeholder="Ej: De por vida" value={formData.acceso} onChange={e => setFormData({ ...formData, acceso: e.target.value })}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Certificado</label>
                                    <input placeholder="Ej: SI" value={formData.certificado} onChange={e => setFormData({ ...formData, certificado: e.target.value })}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold" />
                                </div>
                            </div>

                            {/* ── Temario / Lo que aprenderás ── */}
                            <div className="flex flex-col gap-3 border border-white/10 rounded-3xl p-5 bg-white/3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Lo que aprenderás (Temario)</label>
                                <p className="text-[10px] text-slate-600 -mt-1">Un ítem por línea. Cada línea = una fila en la página del curso.</p>
                                <textarea
                                    rows={6}
                                    placeholder={"Meditación guiada para activación del campo áurico\nTécnica Tameana con cristales de cuarzo\nSanación de niños 0 a 2 años..."}
                                    value={(formData.temario || []).join('\n')}
                                    onChange={e => setFormData({ ...formData, temario: e.target.value.split('\n').filter(l => l.trim()) })}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold text-sm resize-none"
                                />
                                {formData.temario?.length > 0 && (
                                    <p className="text-[10px] text-slate-500 font-bold">{formData.temario.length} ítem{formData.temario.length !== 1 ? 's' : ''} cargado{formData.temario.length !== 1 ? 's' : ''}</p>
                                )}
                            </div>

                            {/* ── SUPABASE STORAGE UPLOAD ── */}
                            <div className="flex flex-col gap-4 border border-white/10 rounded-3xl p-6 bg-white/3">
                                <div className="flex items-center gap-2">
                                    <Paperclip size={14} className="text-primary" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Archivos del Curso</h3>
                                    <span className="ml-auto text-[10px] text-slate-600 font-bold">PDF, Word, Excel, PPT, video, ZIP</span>
                                </div>

                                <div onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-white/15 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                    <Upload size={28} className="mx-auto mb-3 text-slate-600 group-hover:text-primary transition-colors" />
                                    <p className="text-sm font-bold text-slate-500 group-hover:text-slate-300 transition-colors">Hacé clic para seleccionar archivos</p>
                                    <p className="text-[11px] text-slate-600 mt-1">Se suben directamente a Supabase Storage</p>
                                </div>
                                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFilesSelected}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.gif,.webp,.mp4,.mov,.zip" />

                                {/* Upload queue */}
                                {uploadQueue.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">En cola ({uploadQueue.filter(i => i.status === 'pending').length} pendientes)</p>
                                        {uploadQueue.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                                                <FileIcon nombre={item.file.name} tipo={item.file.type} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-300 truncate">{item.file.name}</p>
                                                    <p className="text-[10px] text-slate-600">{formatBytes(item.file.size)}</p>
                                                    {item.status === 'uploading' && <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-primary animate-pulse rounded-full w-full" /></div>}
                                                </div>
                                                {item.status === 'done' && <CheckCircle2 size={16} className="text-green-400 shrink-0" />}
                                                {item.status === 'error' && <AlertCircle size={16} className="text-red-400 shrink-0" />}
                                                {item.status === 'pending' && <button type="button" onClick={() => removeFromQueue(idx)} className="text-slate-600 hover:text-red-400 shrink-0"><X size={14} /></button>}
                                            </div>
                                        ))}
                                        {uploadQueue.some(i => i.status === 'pending') && (
                                            <button type="button" onClick={uploadAll} disabled={isUploading}
                                                className="flex items-center justify-center gap-2 bg-primary text-white rounded-2xl py-3 font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50">
                                                <Upload size={14} /> {isUploading ? 'Subiendo...' : 'Subir Archivos'}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Saved files */}
                                {formData.archivos?.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Guardados ({formData.archivos.length})</p>
                                        {formData.archivos.map((archivo, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-xl p-3">
                                                <FileIcon nombre={archivo.nombre} tipo={archivo.tipo} />
                                                <div className="flex-1 min-w-0">
                                                    <a href={archivo.url} target="_blank" rel="noopener noreferrer"
                                                        className="text-xs font-bold text-slate-300 truncate hover:text-primary transition-colors block">{archivo.nombre}</a>
                                                    <p className="text-[10px] text-slate-600">{formatBytes(archivo.tamaño)}</p>
                                                </div>
                                                <button type="button" onClick={() => removeArchivoGuardado(idx)} className="text-slate-600 hover:text-red-400 shrink-0"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs">
                                {isAdding ? 'Crear Curso' : 'Guardar Cambios'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
