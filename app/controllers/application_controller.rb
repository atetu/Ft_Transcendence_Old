class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token
  rescue_from ActiveRecord::RecordInvalid, :with => :render_error
  rescue_from ActiveRecord::RecordNotFound, :with => :render_error_not_found

  def render_error(error)
    render json: {
             message: "validation failed",
             fields: error.record.errors.as_json,
           }, status: :not_acceptable
  end

  def render_error_not_found(error)
    render json: {
             message: error.to_s,
           }, status: :not_found
  end
end
