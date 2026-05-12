CREATE TABLE public.student_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  submission_type text NOT NULL CHECK (submission_type IN ('exam','assignment','class')),
  full_name text NOT NULL,
  student_id text NOT NULL,
  university text NOT NULL,
  faculty text NOT NULL,
  department text NOT NULL,
  academic_year text NOT NULL,
  semester text NOT NULL,
  subject_name text NOT NULL,
  subject_id text NOT NULL,
  day text,
  start_time text,
  end_time text,
  hall text,
  lecturer text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own submissions" ON public.student_submissions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own submissions" ON public.student_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own submissions" ON public.student_submissions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own submissions" ON public.student_submissions
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_student_submissions_updated_at
  BEFORE UPDATE ON public.student_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_student_submissions_user_type ON public.student_submissions(user_id, submission_type);