class ApplicationController < ActionController::Base
  include CanCan::ControllerAdditions

  skip_before_action :verify_authenticity_token

  rescue_from ActiveRecord::RecordInvalid, :with => :render_error
  rescue_from ActiveRecord::RecordNotFound, :with => :render_error_not_found
  rescue_from CanCan::AccessDenied, :with => :render_error_access_denied
  rescue_from Api::BaseException, :with => :render_error_api

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

  def render_error_access_denied(error)
    # error.instance_variables.each do |x|
    #   puts x
    #   puts error.instance_variable_get("#{x}")
    # end
    render json: {
             message: error.to_s,
           }, status: :forbidden
  end

  def render_error_api(error)
    render json: {
             message: error.message(),
           }, status: error.status()
  end
end
