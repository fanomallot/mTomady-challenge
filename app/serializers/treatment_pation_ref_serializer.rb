class TreatmentPationRefSerializer
  include FastJsonapi::ObjectSerializer
  attributes :treatment_id, :patient_id
end
