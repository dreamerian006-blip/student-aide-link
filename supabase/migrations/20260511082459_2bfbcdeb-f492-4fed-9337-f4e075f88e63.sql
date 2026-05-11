CREATE TABLE public.timetables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  university TEXT NOT NULL,
  faculty TEXT NOT NULL,
  department TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  semester TEXT NOT NULL,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own timetables" ON public.timetables FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own timetables" ON public.timetables FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own timetables" ON public.timetables FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own timetables" ON public.timetables FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER timetables_updated_at BEFORE UPDATE ON public.timetables
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();