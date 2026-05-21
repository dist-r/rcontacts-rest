namespace AspDotNet.Shared;

public class AppException : Exception
{
    public AppException(string message, int code) : base(message)
    {
      Code = code; 
    }
  
    public int Code { get; }

}

