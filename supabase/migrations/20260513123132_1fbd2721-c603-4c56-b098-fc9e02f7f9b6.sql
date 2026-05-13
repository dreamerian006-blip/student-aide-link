-- Study materials table
CREATE TABLE public.study_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_subject TEXT NOT NULL,
  department TEXT NOT NULL,
  faculty TEXT NOT NULL,
  university TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle_year TEXT,
  material_type TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  link_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own study_materials" ON public.study_materials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own study_materials" ON public.study_materials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own study_materials" ON public.study_materials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own study_materials" ON public.study_materials FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_study_materials_updated_at BEFORE UPDATE ON public.study_materials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Lecturer contacts table
CREATE TABLE public.lecturer_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lecturer_name TEXT NOT NULL,
  work_role TEXT NOT NULL,
  department TEXT NOT NULL,
  faculty TEXT NOT NULL,
  university TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT NOT NULL,
  photo_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lecturer_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own lecturer_contacts" ON public.lecturer_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own lecturer_contacts" ON public.lecturer_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own lecturer_contacts" ON public.lecturer_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own lecturer_contacts" ON public.lecturer_contacts FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_lecturer_contacts_updated_at BEFORE UPDATE ON public.lecturer_contacts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('study-materials', 'study-materials', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('lecturer-photos', 'lecturer-photos', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public read study-materials" ON storage.objects FOR SELECT USING (bucket_id = 'study-materials');
CREATE POLICY "Auth upload study-materials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'study-materials' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth update own study-materials" ON storage.objects FOR UPDATE USING (bucket_id = 'study-materials' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth delete own study-materials" ON storage.objects FOR DELETE USING (bucket_id = 'study-materials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read lecturer-photos" ON storage.objects FOR SELECT USING (bucket_id = 'lecturer-photos');
CREATE POLICY "Auth upload lecturer-photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lecturer-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth update own lecturer-photos" ON storage.objects FOR UPDATE USING (bucket_id = 'lecturer-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth delete own lecturer-photos" ON storage.objects FOR DELETE USING (bucket_id = 'lecturer-photos' AND auth.uid()::text = (storage.foldername(name))[1]);